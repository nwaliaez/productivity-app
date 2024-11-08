import React from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import MultipleSelector, { Option } from './ui/multi-select';
import { ControllerRenderProps } from 'react-hook-form';

interface AssignedToSelectorProps {
  field: ControllerRenderProps<any, 'assignedTo'>;
  teams: Option[];
}

const AssignedToSelector: React.FC<AssignedToSelectorProps> = ({
  field,
  teams,
}) => {
  return (
    <FormItem>
      <FormLabel>Assigned To</FormLabel>
      <FormControl>
        <MultipleSelector
          {...field}
          onSearchSync={(searchTerm) => {
            if (!searchTerm) return teams;
            return teams.filter((team) =>
              team.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }}
          triggerSearchOnFocus={true}
          placeholder="Select user(s)..."
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              No results found.
            </p>
          }
        />
      </FormControl>
      <FormDescription>Select the user(s) to assign this task.</FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export default AssignedToSelector;
