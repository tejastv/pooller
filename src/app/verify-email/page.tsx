'use client';

import { useEffect, useState, Suspense, useRef } from 'react'; // Import useRef
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import { applyActionCode, User } from 'firebase/auth'; // Import applyActionCode and User
import { useAuth } from '@/context/AuthContext'; // Import useAuth to access current user

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router
  const { user: authUser } = useAuth(); // Get current authenticated user

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('Please wait...');

  // Ref to track if verification has been attempted for the current oobCode
  const verificationAttemptedRef = useRef(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');

    if (mode === 'verifyEmail' && actionCode) {
      if (!verificationAttemptedRef.current) {
        verificationAttemptedRef.current = true; // Mark as attempted immediately
        setStatus('loading');
        setMessage('Verifying your email, please wait...');
        handleVerifyEmail(actionCode);
      }
    } else if (mode) {
      setStatus('error');
        setMessage(`Unsupported action mode: ${mode}. Please ensure you clicked a valid link.`);
    } else if (authUser?.emailVerified) {
      // If user is already on this page and email is verified (e.g. manual navigation)
      setStatus('success');
      setMessage('Your email is already verified. Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    } else if (authUser?.emailVerified) {
      // If user is already on this page and email is verified (e.g. manual navigation)
      setStatus('success');
      setMessage('Your email is already verified. Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please ensure you copied the full link or request a new one.');
    }
  // Ensure dependencies are correct.
  // Note: verificationAttemptedRef is not needed in dependency array as its change doesn't trigger re-render.
  }, [searchParams, authUser, router]);

  const handleVerifyEmail = async (actionCode: string) => {
    try {
      await applyActionCode(auth, actionCode);
      setStatus('success');
      setMessage('Email successfully verified! You will be redirected to the homepage shortly.');
      // Optionally, you could trigger a re-fetch of user data if your AuthContext doesn't update immediately
      // For example, if you have a function like `auth.currentUser.reload()` and then update context
      setTimeout(() => {
        router.push('/'); // Redirect to homepage
      }, 3000); // Delay for user to read message
    } catch (error: any) {
      setStatus('error');
      console.error("Email verification error:", error);
      if (error.code === 'auth/invalid-action-code') {
        setMessage('Verification link is invalid, expired, or has already been used. Please try verifying your email again or request a new verification link if needed.');
      } else if (error.code === 'auth/user-disabled') {
        setMessage('This user account has been disabled. Please contact support.');
      } else if (error.code === 'auth/user-not-found') {
        setMessage('User not found. This link may be associated with a deleted account.');
      }
      else {
        setMessage(`An error occurred during verification: ${error.message}. Please try again.`);
      }
      // Reset ref if an error occurs that isn't 'invalid-action-code' (already used),
      // allowing a retry if it was a network error for example.
      // However, for 'invalid-action-code', it should remain true.
      if (error.code !== 'auth/invalid-action-code') {
          verificationAttemptedRef.current = false;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline text-primary">Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your verification request...'}
            {status === 'success' && 'Verification complete!'}
            {status === 'error' && 'Verification Problem'}
            {status === 'idle' && 'Waiting for verification link details...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}
          {status === 'success' && (
            <>
              <Alert variant="default" className="text-left">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-600">Verification Successful!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button asChild className="w-full mt-8 text-lg py-3">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <Alert variant="destructive" className="text-left">
                <XCircle className="h-5 w-5" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button asChild className="w-full mt-8 text-lg py-3">
                <Link href="/signin">Back to Sign In</Link>
              </Button>
            </>
          )}
          {status === 'idle' && (
             <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading verification page...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
