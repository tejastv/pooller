
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PollCardProps {
  question: string;
  percentage: number; // Represents a value from 0 to 100
}

const PollCard: FC<PollCardProps> = ({ question, percentage }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold leading-snug text-left">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end flex-grow pt-2">
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-muted-foreground">Engagement</p>
            <p className="text-sm font-medium text-primary">{percentage}%</p>
          </div>
          <Progress value={percentage} className="w-full h-2.5 rounded-full" aria-label={`${percentage}% engagement`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PollCard;
