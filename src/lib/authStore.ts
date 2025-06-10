// In-memory store for demonstration purposes
// In a real application, use a database.

// ===================================================================================
// NOTE: This mock user store is no longer actively used for user authentication,
// password storage, or email verification since Firebase Authentication has been
// integrated. Firebase now handles these functionalities.
//
// This file is kept for reference or potential future use if a separate custom user
// profile database (for application-specific data, not auth data) is implemented.
// If you need to store user profiles, this is where you might manage interactions
// with that custom database, linking profiles to Firebase UIDs.
// ===================================================================================

/*
export interface MockUser {
  id: string;
  email: string;
  password: string; // In a real app, this would be a HASHED password
  verificationToken?: string;
  verificationTokenExpires?: Date;
  isVerified: boolean;
}

export const users: MockUser[] = [];

export function findUserByEmail(email: string): MockUser | undefined {
  // console.log('[AuthStore Deprecated] findUserByEmail called');
  // return users.find(user => user.email === email);
  return undefined;
}

export function findUserByVerificationToken(token: string): MockUser | undefined {
  // console.log('[AuthStore Deprecated] findUserByVerificationToken called');
  // return users.find(user => user.verificationToken === token);
  return undefined;
}

export function createUser(userData: { email: string, password: string, verificationToken: string }): MockUser {
  // console.log('[AuthStore Deprecated] createUser called');
  // const newUser: MockUser = {
  //   id: crypto.randomUUID(),
  //   email: userData.email,
  //   password: userData.password, // Store plain text for mock. HASH IN REAL APP!
  //   verificationToken: userData.verificationToken,
  //   verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token expires in 24 hours
  //   isVerified: false,
  // };
  // users.push(newUser);
  // return newUser;
  throw new Error('[AuthStore Deprecated] createUser called. Use Firebase Auth.');
}

export function verifyUser(userId: string): MockUser | undefined {
  // console.log('[AuthStore Deprecated] verifyUser called');
  // const userIndex = users.findIndex(user => user.id === userId);
  // if (userIndex > -1) {
  //   users[userIndex].isVerified = true;
  //   users[userIndex].verificationToken = undefined;
  //   users[userIndex].verificationTokenExpires = undefined;
  //   return users[userIndex];
  // }
  // return undefined;
  throw new Error('[AuthStore Deprecated] verifyUser called. Email verification handled by Firebase.');
}
*/

// If you decide to create a custom user profile database, you can add functions here, e.g.:
// import { db } from './firebase'; // Assuming you have a Firestore instance
// import { doc, setDoc, getDoc } from 'firebase/firestore';
//
// export async function createUserProfileInDB(userId: string, email: string, additionalData?: any) {
//   try {
//     await setDoc(doc(db, "userProfiles", userId), {
//       email,
//       createdAt: new Date(),
//       ...additionalData
//     });
//     return { success: true, message: "User profile created in DB." };
//   } catch (error) {
//     console.error("Error creating user profile in DB:", error);
//     return { success: false, message: "Failed to create user profile in DB." };
//   }
// }
//
// export async function getUserProfileFromDB(userId: string) {
//   try {
//     const docRef = doc(db, "userProfiles", userId);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       return { success: true, data: docSnap.data() };
//     } else {
//       return { success: false, message: "No such user profile." };
//     }
//   } catch (error) {
//     console.error("Error fetching user profile from DB:", error);
//     return { success: false, message: "Failed to fetch user profile." };
//   }
// }

console.log("src/lib/authStore.ts: This mock store is deprecated for auth. Firebase handles authentication.");
