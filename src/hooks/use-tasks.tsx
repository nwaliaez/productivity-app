// hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { SelectTask } from '../../types'; // Adjust the import path as necessary

interface UseTasksReturn {
  tasks: SelectTask[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTasks = (params: string): UseTasksReturn => {
  const [tasks, setTasks] = useState<SelectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    setLoading(true);
    setError(null);
    let url = `${API_BASE_URL}/tasks`;
    if (params) {
      url += `?params=${params.toString()}`;
    }
    try {
      const res = await fetch(`${url}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch tasks.');
      }
      const data = await res.json();
      console.log(data.tasks);

      setTasks(data.tasks);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const refetch = () => {
    fetchTasks();
  };

  return { tasks, loading, error, refetch };
};
