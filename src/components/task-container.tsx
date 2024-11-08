// components/TasksContainer.tsx
'use client';

import React from 'react';

interface TasksContainerProps {
  children: React.ReactNode;
}

const TasksContainer: React.FC<TasksContainerProps> = ({ children }) => (
  <div className="flex flex-1 flex-col gap-4 p-4">
    <div className="mx-auto w-full rounded-xl">{children}</div>
  </div>
);

export default TasksContainer;
