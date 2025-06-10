
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline">Create Account</CardTitle>
          <CardDescription>Fill in the details below to create your Pooller account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-base">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" className="h-12 text-base" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6">
          <Button className="w-full h-12 text-base">Sign Up</Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
