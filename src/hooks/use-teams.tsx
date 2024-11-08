import { Option } from '@components/ui/multi-select';
import { useState, useEffect } from 'react';

export function useTeams() {
  const [teams, setTeams] = useState<Option[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const response = await fetch(`${API_BASE_URL}/teams`);
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();

        const formattedOptions = data.users.map(
          (user: { userId: string; username: string }) => ({
            label: user.username,
            value: String(user.userId),
          })
        );

        setTeams(formattedOptions);
      } catch (error: any) {
        console.error('Error fetching teams:', error);
        setTeamsError(error.message || 'Unknown error');
      } finally {
        setIsLoadingTeams(false);
      }
    }
    fetchTeams();
  }, []);

  return { teams, isLoadingTeams, teamsError };
}
