'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react'; // Import useState and useEffect
import { toast } from 'react-hot-toast'; // Import toast

// Define the Zod schema based on your Task model (without 'createdBy')
const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().optional(),
  tag: z.string().optional(),
  assignedTo: z
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Must be a positive number.' })
    .int({ message: 'Must be an integer.' })
    .optional(),
  status: z
    .enum(['pending', 'in-progress', 'completed'])
    .optional()
    .default('pending'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.date().optional(),
});

export type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  mode: 'create' | 'edit'; // Mode: 'create' or 'edit'
  initialValues?: TaskFormValues; // Initial values for editing (optional)
  taskId?: string; // Task ID for editing (optional)
  onSubmit: (values: TaskFormValues, taskId?: string) => Promise<void>; // Submit handler
}

export default function TaskForm({
  mode,
  initialValues,
  taskId,
  onSubmit,
}: TaskFormProps) {
  const [loading, setLoading] = useState(false); // Loading state

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: '',
      description: '',
      tag: '',
      assignedTo: undefined,
      status: 'pending',
      priority: 'medium',
      dueDate: undefined,
    },
  });

  // Submit handler
  async function handleFormSubmit(values: TaskFormValues) {
    setLoading(true); // Start loading
    const toastId = toast.loading(
      `${mode === 'create' ? 'Creating' : 'Updating'} task...`
    ); // Show loading toast

    try {
      await onSubmit(values, taskId); // Pass values and taskId to parent onSubmit handler

      // Handle successful submission
      toast.success(
        `${mode === 'create' ? 'Task created' : 'Task updated'} successfully!`,
        { id: toastId }
      );
      form.reset(); // Clears the form fields after submission
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const backgroundClass = mode === 'create' && 'bg-muted/50';

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div
        className={`mx-auto w-full max-w-3xl rounded-xl ${backgroundClass} p-8`}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {mode === 'create' && 'Create New Task'}
        </h2>
        {mode === 'create' && <Separator />}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
            {/* Task Details Section */}
            <div>
              <h3 className="text-xl font-medium mt-4 mb-4">Task Details</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tag */}
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bug, Feature" {...field} />
                      </FormControl>
                      <FormDescription>
                        Categorize the task with a tag.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                              disabled={loading} // Disable button during loading
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                        Set a deadline for the task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Task description"
                        className="resize-none"
                        {...field}
                        disabled={loading} // Disable input during loading
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Assignment Section */}
            <div>
              <h3 className="text-xl font-medium mb-4">Assignment</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Assigned To */}
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="User ID"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                          disabled={loading} // Disable input during loading
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the ID of the user to assign this task to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                  ? 'Create Task'
                  : 'Update Task'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
