// src/components/poll/PollVoteForm.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PollDocument } from '@/actions/poll';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { castVoteAction } from '@/actions/vote'; // Ensure this is imported
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PollVoteFormProps {
  poll: PollDocument;
}

const voteFormSchema = z.object({
  selectedOptionIds: z.array(z.string()).min(1, { message: "Please select at least one option." })
});

type VoteFormValues = z.infer<typeof voteFormSchema>;

export default function PollVoteForm({ poll }: PollVoteFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const routerPathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteFormSchema),
    defaultValues: {
      selectedOptionIds: [],
    },
  });

  const onSubmit = async (data: VoteFormValues) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "Please sign in to vote.", variant: "destructive" });
      return;
    }
    if (poll.originalPollType === 'radio' && data.selectedOptionIds.length > 1) {
        toast({ title: "Invalid Selection", description: "Please select only one option for this poll.", variant: "destructive" });
        return;
    }
    // This check is technically covered by Zod's .min(1) but good as a safeguard.
    if (data.selectedOptionIds.length === 0) {
        toast({ title: "No Selection", description: "Please select an option to vote.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      const result = await castVoteAction(poll.id, data.selectedOptionIds, user.uid);
      if (result.success) {
        toast({ title: "Vote Cast!", description: result.message || "Your vote has been successfully recorded." });
        setVoteSubmitted(true); // Show thank you message, disable form
      } else {
        toast({ title: "Error Casting Vote", description: result.message || "Failed to record your vote.", variant: "destructive" });
      }
    } catch (error) {
        console.error("PollVoteForm onSubmit error:", error);
        toast({ title: "Error", description: "An unexpected error occurred while casting your vote.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (voteSubmitted) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-md">
        <h3 className="text-xl font-semibold text-green-700">Thank you for voting!</h3>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="text-center p-4 border rounded-md">
            <p className="text-muted-foreground mb-3">Please sign in to cast your vote.</p>
            <Button asChild>
                <Link href={`/signin?redirect=${encodeURIComponent(routerPathname)}`}>Sign In to Vote</Link>
            </Button>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {poll.originalPollType === 'radio' ? (
          <Controller
            name="selectedOptionIds"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={(value) => field.onChange(value ? [value] : [])} // Ensure value is passed if present
                value={field.value?.[0] || ""}
                className="space-y-2"
                disabled={isSubmitting || voteSubmitted}
              >
                {poll.options.map((option) => (
                  <FormItem key={option.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <FormControl>
                      <RadioGroupItem value={option.id} />
                    </FormControl>
                    <FormLabel className="font-normal text-base cursor-pointer flex-grow">{option.text}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
          />
        ) : ( // Checkbox type
          <div className="space-y-2">
            {poll.options.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="selectedOptionIds"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), option.id])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value) => value !== option.id
                                  )
                                );
                          }}
                          disabled={isSubmitting || voteSubmitted}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-base cursor-pointer flex-grow">
                        {option.text}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        )}
        <FormMessage>{form.formState.errors.selectedOptionIds?.message}</FormMessage>

        <Button
          type="submit"
          className="w-full text-lg py-6"
          disabled={isSubmitting || voteSubmitted || (form.watch('selectedOptionIds') && form.watch('selectedOptionIds').length === 0)}
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Vote"}
        </Button>
      </form>
    </Form>
  );
}
