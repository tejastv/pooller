// src/actions/poll.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Define the expected structure of the form data coming from the client
interface ClientPollFormValues {
  description: string;
  pollType: 'radio' | 'checkbox'; // pollType is a top-level field
  options: { text: string }[]; // Individual options only have text
}

// Interface for the data structure to be saved in Firestore
interface PollDataToSave {
  description: string;
  options: { id: string; text: string; type: 'radio' | 'checkbox' }[];
  creatorId: string;
  createdAt: any;
  allowMultipleVotes: boolean;
  originalPollType: 'radio' | 'checkbox'; // Store the original pollType for clarity
}

export async function createPollAction(
  pollData: ClientPollFormValues, // Use the explicitly defined interface here
  creatorId: string
): Promise<{ success: boolean; message?: string; pollId?: string }> {
  if (!creatorId) {
    return { success: false, message: 'User not authenticated.' };
  }

  try {
    // Determine allowMultipleVotes and the uniform option type from the global pollType
    const allowMultipleVotes = pollData.pollType === 'checkbox';
    const uniformOptionType = pollData.pollType; // 'radio' or 'checkbox'

    const optionsWithIdsAndType = pollData.options.map((opt, index) => ({
      text: opt.text,
      type: uniformOptionType, // Set uniform type for all options
      id: `option_${index + 1}_${Date.now()}`
    }));

    const pollToSave: PollDataToSave = {
      description: pollData.description,
      options: optionsWithIdsAndType,
      creatorId,
      createdAt: serverTimestamp(),
      allowMultipleVotes,
      originalPollType: pollData.pollType, // Store the original pollType
    };

    const docRef = await addDoc(collection(db, 'polls'), pollToSave);
    return { success: true, pollId: docRef.id, message: 'Poll created successfully!' };
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return { success: false, message: `Failed to create poll: ${error.message}` };
  }
}
