// src/components/PollCard.tsx
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Progress import is no longer needed
// import { Progress } from "@/components/ui/progress";
import Link from 'next/link'; // Import Link for future navigation
import { Button } from '@/components/ui/button'; // For a potential "View Poll" button

interface PollCardProps {
  id: string; // Add id prop
  question: string; // This will receive the poll's description
  // percentage prop is removed
}

const PollCard: FC<PollCardProps> = ({ id, question }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-4"> {/* Adjusted padding slightly */}
        <CardTitle className="text-lg font-semibold leading-snug text-left">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end flex-grow pt-2">
        {/* UI for percentage and progress bar is removed */}
        {/* Future enhancements:
            - Display number of options
            - Display number of votes
            - Link to a page to view/vote on the poll
        */}
        <div className="mt-auto">
          {/* Example: Add a button to view the poll (linking to a future poll details page) */}
          <Link href={`/poll/${id}`} passHref legacyBehavior>
            <Button variant="outline" className="w-full mt-4">
              View Poll
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollCard;
