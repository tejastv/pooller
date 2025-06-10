
// In-memory store for demonstration purposes
// In a real application, use a database.

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
  return users.find(user => user.email === email);
}

export function findUserByVerificationToken(token: string): MockUser | undefined {
  return users.find(user => user.verificationToken === token);
}

export function createUser(userData: { email: string, password: string, verificationToken: string }): MockUser {
  const newUser: MockUser = {
    id: crypto.randomUUID(),
    email: userData.email,
    password: userData.password, // Store plain text for mock. HASH IN REAL APP!
    verificationToken: userData.verificationToken,
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token expires in 24 hours
    isVerified: false,
  };
  users.push(newUser);
  return newUser;
}

export function verifyUser(userId: string): MockUser | undefined {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex > -1) {
    users[userIndex].isVerified = true;
    users[userIndex].verificationToken = undefined;
    users[userIndex].verificationTokenExpires = undefined;
    return users[userIndex];
  }
  return undefined;
}
