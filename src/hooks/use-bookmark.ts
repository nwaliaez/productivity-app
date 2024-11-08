// hooks/useBookmark.ts
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseBookmarkProps {
  refetch: () => void; // Function to refetch data after bookmarking
}

interface UseBookmarkReturn {
  handleBookmarkClick: (
    taskId: number,
    currentIsBookmarked: boolean
  ) => Promise<void>;
  loadingTaskIds: Set<number>;
  errorTaskIds: Record<number, string>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const useBookmark = ({
  refetch,
}: UseBookmarkProps): UseBookmarkReturn => {
  const [loadingTaskIds, setLoadingTaskIds] = useState<Set<number>>(new Set());
  const [errorTaskIds, setErrorTaskIds] = useState<Record<number, string>>({});

  const handleBookmarkClick = async (
    taskId: number,
    currentIsBookmarked: boolean
  ) => {
    // Add taskId to loading set
    setLoadingTaskIds((prev) => new Set(prev).add(taskId));

    // Reset previous error for this task
    setErrorTaskIds((prev) => ({ ...prev, [taskId]: '' }));

    try {
      const response = await fetch(`${API_BASE_URL}/bookmark`, {
        method: currentIsBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refetch data to update bookmark status
        refetch();

        // Show success toast
        toast.success(
          currentIsBookmarked
            ? 'Bookmark removed successfully.'
            : 'Bookmark added successfully.'
        );
      } else {
        // Handle server errors
        const errorMessage = data.message || 'Operation failed.';
        setErrorTaskIds((prev) => ({
          ...prev,
          [taskId]: errorMessage,
        }));
        console.error('Error:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      // Handle network or unexpected errors
      const networkError = 'A network error occurred. Please try again.';
      setErrorTaskIds((prev) => ({
        ...prev,
        [taskId]: networkError,
      }));
      console.error('Network error:', err);
      toast.error(networkError);
    } finally {
      // Remove taskId from loading set
      setLoadingTaskIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  return { handleBookmarkClick, loadingTaskIds, errorTaskIds };
};
