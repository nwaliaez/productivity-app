// pages/tasks.tsx
'use client';

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import EditTaskDialog from '@components/EditTaskDialog';
import TaskList from '@components/task-list';
import TasksContainer from '@components/task-container';
import LoadingSpinner from '@components/loading-spinner';
import ErrorMessage from '@components/error-message';
import { useTasks } from 'hooks/use-tasks'; // Custom hook for fetching tasks
import { useBookmark } from 'hooks/use-bookmark'; // Custom bookmark hook
import { SelectTask } from '../../../../types';
import DeleteTaskDialog from '@components/DeleteTaskDialog';

export default function TaskPage() {
  const { tasks, loading, error, refetch } = useTasks('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SelectTask | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<Number | null>(null);

  // Utilize the useBookmark hook
  const { handleBookmarkClick, loadingTaskIds, errorTaskIds } = useBookmark({
    refetch,
  });

  const handleEditClick = (task: SelectTask) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (taskId: Number | null) => {
    setSelectedTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTask = (deletedTaskId: Number) => {
    if (deletedTaskId) {
      // Implement your save logic here, e.g., updating the task via API
      // After saving, refetch the tasks to get updated data
      refetch();
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveTask = (updatedTask: Partial<SelectTask>) => {
    if (selectedTask) {
      // Implement your save logic here, e.g., updating the task via API
      // After saving, refetch the tasks to get updated data
      refetch();
      setEditDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <TasksContainer>
        <LoadingSpinner />
      </TasksContainer>
    );
  }

  if (error) {
    return (
      <TasksContainer>
        <ErrorMessage message={error} />
      </TasksContainer>
    );
  }

  return (
    <TasksContainer>
      <TaskList
        tasks={tasks}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onBookmark={handleBookmarkClick}
        loadingTaskIds={loadingTaskIds}
        errorTaskIds={errorTaskIds}
      />

      {selectedTask && (
        <EditTaskDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          selectedTask={selectedTask}
          onSave={handleSaveTask}
        />
      )}
      {selectedTaskId && (
        <DeleteTaskDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          selectedTaskId={selectedTaskId}
          onDelete={handleDeleteTask}
        />
      )}
      <Toaster />
    </TasksContainer>
  );
}
