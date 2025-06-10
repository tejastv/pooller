import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold font-headline text-primary mt-8 mb-6">
        Welcome to Pooller
      </h1>
      <p className="text-xl text-foreground mb-8 max-w-2xl">
        The best platform to connect, collaborate, and pool resources for your projects and goals. Join our community and make great things happen together!
      </p>
      <div className="mb-12">
        <Image
          src="https://placehold.co/700x450.png"
          alt="Collaborative team working together"
          width={700}
          height={450}
          className="rounded-xl shadow-2xl"
          data-ai-hint="team collaboration"
        />
      </div>
      <Link href="/signin" passHref>
        <Button size="lg" className="px-8 py-3 text-lg">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
