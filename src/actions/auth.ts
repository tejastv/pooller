
'use server';

import { createUser as createUserInStore, findUserByEmail, findUserByVerificationToken, verifyUser as verifyUserInStore } from '@/lib/authStore';
import { z } from 'zod';

// In a real app, use a proper email sending service (e.g., SendGrid, Nodemailer, AWS SES)
async function sendMockVerificationEmail(email: string, token: string, origin: string) {
  const verificationLink = `${origin}/verify-email?token=${token}`;
  
  console.log("---- MOCK EMAIL SENDING ----");
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your Pooller Account`);
  console.log(`Body: Click here to verify: ${verificationLink}`);
  console.log("---------------------------");
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return { success: true, message: 'Mock verification email sent.' };
}

const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8), // Password complexity should align with form validation
});

export async function registerUserAndSendVerification(
  values: z.infer<typeof RegisterUserSchema>,
  origin: string // The base URL (e.g., http://localhost:3000)
) {
  try {
    const existingUser = findUserByEmail(values.email);
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const verificationToken = crypto.randomUUID();
    
    // In a real app, hash the password before storing
    createUserInStore({
      email: values.email,
      password: values.password, 
      verificationToken,
    });

    const emailResult = await sendMockVerificationEmail(values.email, verificationToken, origin);

    if (!emailResult.success) {
      // Handle email sending failure, e.g., log error, notify admin
      // For this mock, we'll assume it could fail but proceed with a message.
      return { success: false, message: 'Registration succeeded, but failed to send verification email (mock error).' };
    }

    return { success: true, message: 'Registration successful! Please check your email (and console for mock link) to verify your account.' };
  } catch (error) {
    console.error('Registration Action Error:', error);
    return { success: false, message: 'An unexpected error occurred during registration.' };
  }
}

export async function verifyTokenAndActivateUser(token: string | null) {
  try {
    if (!token) {
      return { success: false, message: 'Verification token is missing.' };
    }

    const user = findUserByVerificationToken(token);

    if (!user) {
      return { success: false, message: 'Invalid or expired verification token.' };
    }

    if (user.isVerified) {
      return { success: true, message: 'Email already verified. You can now sign in.' };
    }
    
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      // In a real app, you might offer to resend a token or delete the user record.
      // For now, just mark as expired.
      return { success: false, message: 'Verification token has expired. Please try registering again.' };
    }

    verifyUserInStore(user.id);
    return { success: true, message: 'Email successfully verified! You can now sign in.' };

  } catch (error) {
    console.error('Token Verification Action Error:', error);
    return { success: false, message: 'An unexpected error occurred during email verification.' };
  }
}
