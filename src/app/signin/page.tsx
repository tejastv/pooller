// src/app/signin/page.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useState, Suspense } from "react"; // Import Suspense
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Loader2 } from 'lucide-react'; // For Suspense fallback

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type SignInFormValues = z.infer<typeof formSchema>;

// Inner component to use useSearchParams
function SignInFormComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Sign In Successful",
        description: `Welcome back, ${userCredential.user.email}!`,
      });
      form.reset();

      const redirectPath = searchParams.get('redirect'); // Get redirect path from query
      if (redirectPath && redirectPath.startsWith('/')) { // Basic validation for local path
        router.push(redirectPath);
      } else {
        router.push('/'); // Default redirect to homepage
      }
    } catch (error) {
      console.error("Sign in page error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': // Added this as it's a common one
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The email address is not valid.";
            break;
          case 'auth/user-disabled':
            errorMessage = "This account has been disabled.";
            break;
          default:
            errorMessage = `Sign in failed: ${error.message}`;
        }
      }
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your Pooller account.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6 p-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} className="h-12 text-base" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-12 text-base" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 pt-0">
              <Button type="submit" className="w-full h-12 text-base" disabled={!form.formState.isValid || isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

// Wrap SignInFormComponent with Suspense for useSearchParams
export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <SignInFormComponent />
    </Suspense>
  );
}
