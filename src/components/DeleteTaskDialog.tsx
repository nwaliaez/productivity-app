import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@components/ui/dialog';

interface DeleteTaskDialogProps {
  open: boolean;
  selectedTaskId: Number;
  onOpenChange: (open: boolean) => void;
  onDelete: (taskId: Number) => void;
  // onCancel: () => void;
}

export default function DeleteTaskDialog({
  open,
  onOpenChange,
  onDelete,
  // onCancel,
  selectedTaskId,
}: DeleteTaskDialogProps) {
  const handleDelete = async (taskId: Number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Adjust the base URL as needed
      const response = await fetch(`${API_BASE_URL}/tasks?taskId=${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      const result = await response.json();
      onDelete(taskId);
      onOpenChange(false);
    } catch (error) {
      console.error('Delete error:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => {}}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => {
              handleDelete(selectedTaskId);
            }}
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
