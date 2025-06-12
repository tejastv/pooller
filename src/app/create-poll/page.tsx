// src/app/create-poll/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { XIcon, PlusIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createPollAction } from '@/actions/poll';
import Link from 'next/link';

// Revised Zod schema
const optionSchema = z.object({
  text: z.string().min(1, { message: "Option text cannot be empty." }).max(100, { message: "Option text too long." }),
});

const pollFormSchema = z.object({
  description: z.string().min(5, { message: "Description must be at least 5 characters." }).max(500, { message: "Description too long." }),
  pollType: z.enum(["radio", "checkbox"], { required_error: "Please select a poll type." }),
  options: z.array(optionSchema)
    .min(2, { message: "Must have at least 2 options." })
    .max(10, { message: "Cannot have more than 10 options." }),
});

export type PollFormValues = z.infer<typeof pollFormSchema>;

const MAX_OPTIONS = 10;

export default function CreatePollPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      pollType: "radio",
      options: [
        { text: "" },
        { text: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: PollFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a poll.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPollAction(data, user.uid);

      if (result.success) {
        toast({
          title: "Poll Created!",
          description: result.message || "Your poll has been successfully created.",
        });
        form.reset();
        router.push('/');
      } else {
        toast({
          title: "Error Creating Poll",
          description: result.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Create Poll Page Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred on the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline">Create a New Poll</CardTitle>
          <CardDescription>Fill in the details below to create your poll.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!user ? (
             <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">Please sign in to create a poll.</p>
                <Button asChild>
                    <Link href={`/signin?redirect=${encodeURIComponent('/create-poll')}`}>Sign In</Link>
                </Button>
             </div>
          ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Poll Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What would you like to ask?"
                        className="resize-none min-h-[100px]"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pollType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg">Poll Answer Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                        disabled={isLoading}
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="radio" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Single Answer (Multiple Choice)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="checkbox" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Multiple Answers (Checkboxes)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-lg mb-2 block">Poll Options</FormLabel>
                {fields.map((item, index) => (
                  <Card key={item.id} className="mb-4 p-4 space-y-3 bg-muted/30">
                    <FormField
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Option {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Enter option ${index + 1} text`} {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                        className="mt-2"
                        disabled={isLoading}
                      >
                        <XIcon className="h-4 w-4 mr-1" /> Remove Option
                      </Button>
                    )}
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ text: "" })}
                  disabled={fields.length >= MAX_OPTIONS || isLoading}
                  className="mt-2"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Option
                </Button>
                {form.formState.errors.options && !form.formState.errors.options.root && form.formState.errors.options.message && (
                     <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.options.message}</p>
                )}
                 {form.formState.errors.options?.root?.message && (
                     <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.options.root.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading || !form.formState.isValid || !user}>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Create Poll"}
              </Button>
            </form>
          </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
