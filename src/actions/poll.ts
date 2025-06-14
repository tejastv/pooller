// src/actions/poll.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore'; // Import additional Firestore functions

// Interface for ClientPollFormValues (already defined for createPollAction)
interface ClientPollFormValues {
  description: string;
  pollType: 'radio' | 'checkbox';
  options: { text: string }[];
}

// Interface for PollDataToSave (already defined for createPollAction)
interface PollDataToSave {
  description: string;
  options: { id: string; text: string; type: 'radio' | 'checkbox' }[];
  creatorId: string;
  createdAt: any;
  allowMultipleVotes: boolean;
  originalPollType: 'radio' | 'checkbox';
}

// --- createPollAction function (already exists) ---
export async function createPollAction(
  pollData: ClientPollFormValues,
  creatorId: string
): Promise<{ success: boolean; message?: string; pollId?: string }> {
  if (!creatorId) {
    return { success: false, message: 'User not authenticated.' };
  }
  try {
    const allowMultipleVotes = pollData.pollType === 'checkbox';
    const uniformOptionType = pollData.pollType;
    const optionsWithIdsAndType = pollData.options.map((opt, index) => ({
      text: opt.text,
      type: uniformOptionType,
      id: `option_${index + 1}_${Date.now()}`
    }));
    const pollToSave: PollDataToSave = {
      description: pollData.description,
      options: optionsWithIdsAndType,
      creatorId,
      createdAt: serverTimestamp(),
      allowMultipleVotes,
      originalPollType: pollData.pollType,
    };
    const docRef = await addDoc(collection(db, 'polls'), pollToSave);
    return { success: true, pollId: docRef.id, message: 'Poll created successfully!' };
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return { success: false, message: `Failed to create poll: ${error.message}` };
  }
}

// --- New server action to fetch polls ---

// Define the structure of a poll as it will be returned by getPolls
// This might be slightly different from PollDataToSave if we transform data (e.g., createdAt to string)
export interface PollDocument extends Omit<PollDataToSave, 'createdAt'> {
  id: string; // Firestore document ID
  createdAt: string; // Convert Firestore Timestamp to string for client components if needed
                      // For Server Components, Timestamp object can often be used directly by child client components
                      // if they handle it, or we can convert it here. Let's start with string.
}


export async function getPolls(): Promise<PollDocument[]> {
  try {
    const pollsCollection = collection(db, 'polls');
    // Query to get polls, ordered by creation date (newest first), limited to 12
    const q = query(pollsCollection, orderBy('createdAt', 'desc'), limit(12));

    const querySnapshot = await getDocs(q);

    const polls: PollDocument[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as PollDataToSave; // Cast to the structure written to Firestore

      // Convert Firestore Timestamp to a serializable format (ISO string)
      // Or handle in component if it can take Timestamp
      let createdAtString = '';
      if (data.createdAt instanceof Timestamp) {
        createdAtString = data.createdAt.toDate().toISOString();
      } else if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        // Handle cases where it might be a plain object after server-side rendering or other transformations
         createdAtString = new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate().toISOString();
      }


      return {
        id: doc.id,
        ...data,
        createdAt: createdAtString, // Override with string version
      };
    });

    return polls;
  } catch (error) {
    console.error('Error fetching polls:', error);
    return []; // Return an empty array in case of error
  }
}
