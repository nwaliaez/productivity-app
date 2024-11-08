// components/TaskList.tsx
'use client';

import React from 'react';
import TaskCard from './task-card';
import { SelectTask } from '../../types'; // Adjust the import path as necessary

interface TaskListProps {
  tasks: SelectTask[];
  onEdit: (task: SelectTask) => void;
  onDelete: (taskId: Number | null) => void;
  onBookmark: (taskId: number, isBookmarked: boolean) => void;
  loadingTaskIds: Set<number>;
  errorTaskIds: Record<number, string>; // Added errorTaskIds
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onBookmark,
  loadingTaskIds,
  errorTaskIds, // Destructure errorTaskIds
}) => {
  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground">No tasks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task: SelectTask) => (
        <TaskCard
          key={task.taskId}
          task={task}
          onEdit={onEdit}
          onBookmark={onBookmark}
          onDelete={onDelete}
          loadingTaskIds={loadingTaskIds}
          errorTaskIds={errorTaskIds} // Pass errorTaskIds to TaskCard
        />
      ))}
    </div>
  );
};

export default TaskList;
