// src/components/PollCard.tsx
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PollDocument } from '@/actions/poll'; // Import the PollDocument type
import { ListChecks, ListOrderedIcon } from 'lucide-react'; // Example icons

interface PollCardProps {
  poll: PollDocument; // Pass the entire poll object
}

const PollCard: FC<PollCardProps> = ({ poll }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-2"> {/* Reduced bottom padding to give more space for content */}
        <CardTitle className="text-lg font-semibold leading-snug text-left">
          {poll.description} {/* Use poll.description */}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow pt-2 space-y-3"> {/* Added space-y-3 for content spacing */}

        {/* Display Poll Options */}
        {poll.options && poll.options.length > 0 && (
          <div className="text-sm text-muted-foreground text-left space-y-1">
            <h4 className="mb-1 font-medium text-foreground flex items-center">
              {poll.allowMultipleVotes ?
                <ListChecks className="h-4 w-4 mr-2 text-primary" /> :
                <ListOrderedIcon className="h-4 w-4 mr-2 text-primary" />}
              Options:
            </h4>
            <ul className="list-none pl-1 space-y-0.5">
              {poll.options.slice(0, 3).map((option) => ( // Show first 3 options as a preview
                <li key={option.id} className="truncate">
                  - {option.text}
                </li>
              ))}
              {poll.options.length > 3 && (
                <li className="text-xs text-primary/80">...and {poll.options.length - 3} more.</li>
              )}
            </ul>
          </div>
        )}

        {/* Spacer to push button to the bottom if content is short */}
        <div className="flex-grow" />

        <div className="mt-auto pt-3"> {/* Added pt-3 for spacing above button */}
          <Link href={`/poll/${poll.id}`} passHref legacyBehavior>
            <Button variant="outline" className="w-full">
              View Poll & Vote
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollCard;
