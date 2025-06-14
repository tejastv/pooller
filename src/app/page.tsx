// src/app/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PollCard from '@/components/PollCard';
import { getPolls, PollDocument } from '@/actions/poll'; // Import getPolls and PollDocument type

// Mock data for polls is now removed

export default async function HomePage() { // Make the component async
  const polls: PollDocument[] = await getPolls(); // Fetch polls

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-5xl font-bold font-headline text-primary mt-8 mb-6">
        Welcome to Pooller
      </h1>
      <p className="text-xl text-foreground mb-10 max-w-2xl">
        Create, share, and participate in polls. See what the community thinks and make your voice heard!
      </p>

      <section className="w-full max-w-5xl mb-12">
        <h2 className="text-3xl font-semibold text-foreground mb-8">
          Active Polls
        </h2>
        {polls && polls.length > 0 ? ( // Use fetched polls
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard
                key={poll.id}
                id={poll.id} // Pass poll.id as id prop
                question={poll.description} // Use poll.description for the question prop
                // percentage prop is temporarily removed/ignored
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">
            No active polls at the moment. Why not <Link href="/create-poll" className="text-primary hover:underline">create one</Link>?
          </p>
        )}
      </section>

      <Link href="/create-poll" passHref>
        <Button size="lg" className="px-8 py-3 text-lg">
          Join or Create Polls
        </Button>
      </Link>
    </div>
  );
}
