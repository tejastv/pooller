// src/actions/vote.ts
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { PollDocument } from '@/actions/poll'; // Assuming PollDocument includes poll structure like options and originalPollType

interface VoteData {
  selectedOptionIds: string[];
  votedAt: any; // Firestore Server Timestamp
  pollTypeVoted: 'radio' | 'checkbox';
}

export async function castVoteAction(
  pollId: string,
  selectedOptionIds: string[],
  userId: string
): Promise<{ success: boolean; message?: string }> {
  if (!userId) {
    return { success: false, message: 'User not authenticated.' };
  }
  if (!pollId || !selectedOptionIds || selectedOptionIds.length === 0) {
    return { success: false, message: 'Poll ID and at least one selected option are required.' };
  }

  const pollDocRef = doc(db, 'polls', pollId);
  const voteDocRef = doc(db, 'polls', pollId, 'votes', userId); // Use userId as vote document ID

  try {
    const pollSnapshot = await getDoc(pollDocRef);
    if (!pollSnapshot.exists()) {
      return { success: false, message: 'Poll not found.' };
    }

    const pollData = pollSnapshot.data() as PollDocument; // Cast to full poll structure

    // Validate selectedOptionIds against the poll's actual options
    const validOptionIds = pollData.options.map(opt => opt.id);
    for (const selectedId of selectedOptionIds) {
      if (!validOptionIds.includes(selectedId)) {
        return { success: false, message: `Invalid option ID selected: ${selectedId}.` };
      }
    }

    // Enforce single selection for radio polls
    if (pollData.originalPollType === 'radio' && selectedOptionIds.length > 1) {
      return { success: false, message: 'Only one option can be selected for this type of poll.' };
    }

    // Check if user has already voted (optional - current logic will overwrite/allow changing vote)
    // const existingVoteSnap = await getDoc(voteDocRef);
    // if (existingVoteSnap.exists()) {
    //   return { success: false, message: 'You have already voted on this poll.' };
    // }

    const voteToSave: VoteData = {
      selectedOptionIds: selectedOptionIds,
      votedAt: serverTimestamp(),
      pollTypeVoted: pollData.originalPollType, // Store the type of poll this vote was for
    };

    // Using setDoc with userId as doc ID will create or overwrite.
    // This means user can change their vote.
    await setDoc(voteDocRef, voteToSave);

    return { success: true, message: 'Vote cast successfully!' };
  } catch (error: any) {
    console.error('Error casting vote:', error);
    return { success: false, message: `Failed to cast vote: ${error.message}` };
  }
}
