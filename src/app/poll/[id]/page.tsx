// src/app/poll/[id]/page.tsx

import { notFound } from 'next/navigation';
import { getPollById, PollDocument } from '@/actions/poll'; // Import action and type
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // For styling
import { ListChecks, ListOrderedIcon } from 'lucide-react'; // Icons for poll type

interface PollDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const pollId = params.id;
  const poll: PollDocument | null = await getPollById(pollId);

  if (!poll) {
    notFound(); // Render the default 404 page if poll not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Removed the generic "Poll Details" h1, CardTitle will serve as main title */}
      <Card className="w-full max-w-2xl mx-auto shadow-xl"> {/* Centered card */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">{poll.description}</CardTitle>
          <CardDescription className="pt-2">
            Created on: {new Date(poll.createdAt).toLocaleDateString()} by User: {poll.creatorId.substring(0,6)}...
            {/* TODO: Fetch and display creator's username if available later */}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              {poll.originalPollType === 'checkbox' ?
                <ListChecks className="h-5 w-5 mr-2 text-primary" /> :
                <ListOrderedIcon className="h-5 w-5 mr-2 text-primary" />}
              Options:
            </h3>
            <ul className="space-y-2">
              {poll.options.map((option) => (
                <li key={option.id} className="p-3 bg-muted/50 rounded-md text-left">
                  {option.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder for PollVoteForm client component (Step 4) */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Cast Your Vote</h3>
            <p className="text-center text-muted-foreground">
              {/* Voting form will appear here. */}
            </p>
            {/* <PollVoteForm poll={poll} /> will go here */}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for related polls or other content - can be added later */}
      {/* <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Related Polls</h3>
        <p>Related polls sidebar content will go here.</p>
      </div> */}
    </div>
  );
}
