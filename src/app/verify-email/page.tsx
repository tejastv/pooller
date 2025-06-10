
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react'; // Added icons
import { verifyTokenAndActivateUser } from '@/actions/auth';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email, please wait...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification link is invalid or missing a token.');
      return;
    }

    const verifyEmail = async () => {
      setStatus('loading');
      const result = await verifyTokenAndActivateUser(token);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message || 'An unknown error occurred during verification.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline text-primary">Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' ? 'Processing your verification request...' : 'Verification complete.'}
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
            <Alert variant="default" className="text-left">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-600">Verification Successful!</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {status === 'error' && (
            <Alert variant="destructive" className="text-left">
              <XCircle className="h-5 w-5" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {(status === 'success' || status === 'error') && (
            <Button asChild className="w-full mt-8 text-lg py-3">
              <Link href="/signin">Proceed to Sign In</Link>
            </Button>
          )}
           {status === 'error' && !token && (
             <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/signup">Back to Sign Up</Link>
            </Button>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap VerifyEmailContent with Suspense because useSearchParams can suspend
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
