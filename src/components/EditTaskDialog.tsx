import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@components/ui/dialog';
import TaskForm, { TaskFormValues } from './task-form';
import { SelectTask } from 'db/schema';

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: SelectTask | null;
  onSave: (updatedTask: Partial<SelectTask>) => void;
}

export default function EditTaskDialog({
  open,
  onOpenChange,
  selectedTask,
  onSave,
}: EditTaskDialogProps) {
  // Convert selectedTask to TaskFormValues for pre-filling the form
  const initialValues: TaskFormValues = {
    title: selectedTask?.title || '',
    description: selectedTask?.description || '',
    tag: selectedTask?.tag || '',
    // assignedTo: selectedTask?.assignedTo || undefined,
    assignedTo: [],
    status:
      (selectedTask?.status as 'pending' | 'in-progress' | 'completed') ||
      'pending',
    priority: (selectedTask?.priority as 'low' | 'medium' | 'high') || 'medium',
    dueDate: selectedTask?.dueDate ? new Date(selectedTask.dueDate) : undefined,
  };

  const handleSave = async (values: TaskFormValues) => {
    const updatedTask: Partial<SelectTask> = {
      ...selectedTask,
      ...values,
      dueDate: values.dueDate
        ? values.dueDate.toISOString().split('T')[0]
        : null, // Convert to string or null
    };

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      // Make the PUT request to update the task
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      const result = await response.json();

      if (response.ok) {
        // Call onSave with the updated task if the response is successful
        onSave(result.updatedTask);
        onOpenChange(false); // Close the dialog
      } else {
        console.error('Failed to update task:', result.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task details and save changes.
          </DialogDescription>
        </DialogHeader>
        {selectedTask && (
          <TaskForm
            mode="edit" // Edit mode
            initialValues={initialValues} // Pass initial values from selectedTask
            taskId={selectedTask.taskId} // Pass the task ID to handle updates
            onSubmit={handleSave} // Handle form submission
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
