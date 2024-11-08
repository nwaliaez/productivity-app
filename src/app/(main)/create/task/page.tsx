'use client';
import TaskForm, { TaskFormValues } from '@components/task-form';
import React from 'react';

const page = () => {
  async function createTaskHandler(values: TaskFormValues) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), // Pass the form values as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      // You can perform further actions here, such as refetching the task list or redirecting
    } catch (error) {
      console.error('Error creating task:', error);
      throw error; // Re-throw the error so the form can handle it (e.g., show a toast)
    }
  }
  return <TaskForm mode="create" onSubmit={createTaskHandler} />;
};

export default page;
