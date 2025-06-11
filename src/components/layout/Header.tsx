'use client'; // Required for hooks like useAuth, useRouter

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import { signOut } from 'firebase/auth'; // Import signOut
import { useRouter } from 'next/navigation'; // Import useRouter
import { Loader2 } from 'lucide-react'; // For loading indicator

const Header = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to homepage after logout
      // Optionally, show a toast message for successful logout
    } catch (error) {
      console.error('Logout Error:', error);
      // Optionally, show a toast message for logout error
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          <Link href="/" legacyBehavior>
            <a className="text-3xl font-bold text-accent font-headline hover:opacity-80 transition-opacity">
              Pooller
            </a>
          </Link>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : user && user.emailVerified ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
                <Button onClick={handleLogout} variant="outline" size="lg">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" legacyBehavior passHref>
                  <Button asChild size="lg" variant="default">
                    <a>Sign In</a>
                  </Button>
                </Link>
                <Link href="/signup" legacyBehavior passHref>
                  <Button asChild size="lg" variant="secondary" className="hidden sm:flex">
                    <a>Sign Up</a>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
