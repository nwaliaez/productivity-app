import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ITask } from '@models/Task';
import TaskForm, { TaskFormValues } from './task-form';

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: ITask | null;
  onSave: (updatedTask: Partial<ITask>) => void;
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
    assignedTo: selectedTask?.assignedTo || undefined,
    status:
      (selectedTask?.status as 'pending' | 'in-progress' | 'completed') ||
      'pending',
    priority: (selectedTask?.priority as 'low' | 'medium' | 'high') || 'medium',
    dueDate: selectedTask?.dueDate ? new Date(selectedTask.dueDate) : undefined,
  };

  const handleSave = async (values: TaskFormValues) => {
    const updatedTask: Partial<ITask> = {
      ...selectedTask,
      ...values,
    };

    onSave(updatedTask); // Call onSave with the updated task
    onOpenChange(false); // Close the dialog
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
            taskId={selectedTask._id} // Pass the task ID to handle updates
            onSubmit={handleSave} // Handle form submission
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
