
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PollCard from '@/components/PollCard';

// Mock data for polls
const mockPolls = [
  { id: '1', question: 'What is your favorite season for outdoor activities?', percentage: 75 },
  { id: '2', question: 'Should remote work be a standard option for all office jobs?', percentage: 50 },
  { id: '3', question: 'Which programming language do you find most enjoyable to use?', percentage: 90 },
  { id: '4', question: 'What type of content do you prefer on streaming services: movies or series?', percentage: 60 },
  { id: '5', question: 'Is a four-day work week more productive than a five-day work week?', percentage: 30 },
  { id: '6', question: 'What is the most important factor when choosing a new smartphone?', percentage: 85 },
];

export default function HomePage() {
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
        {mockPolls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPolls.map((poll) => (
              <PollCard
                key={poll.id}
                question={poll.question}
                percentage={poll.percentage}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">
            No active polls at the moment. Why not create one?
          </p>
        )}
      </section>

      <Link href="/signin" passHref>
        <Button size="lg" className="px-8 py-3 text-lg">
          Join or Create Polls
        </Button>
      </Link>
    </div>
  );
}
