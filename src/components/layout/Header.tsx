import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          <Link href="/" legacyBehavior>
            <a className="text-3xl font-bold text-accent font-headline hover:opacity-80 transition-opacity">
              Pooller
            </a>
          </Link>
          <Link href="/signin" legacyBehavior>
            <Button asChild size="lg">
              <a>Sign In</a>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
