// components/TaskCard.tsx
'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from 'components/ui/card';
import { format } from 'date-fns';
import {
  Bookmark,
  CheckCircle,
  Circle,
  Edit3,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@components/ui/dropdown-menu';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';

import { SelectTask } from '../../types';

interface TaskCardProps {
  task: SelectTask;
  onEdit: (task: SelectTask) => void;
  onDelete: (taskId: Number) => void;
  onBookmark: (taskId: number, isBookmarked: boolean) => void;
  loadingTaskIds: Set<number>;
  errorTaskIds: Record<number, string>; // Added errorTaskIds
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onBookmark,
  loadingTaskIds,
  errorTaskIds, // Destructure errorTaskIds
}) => {
  const isLoading = loadingTaskIds.has(task.taskId);
  const errorMessage = errorTaskIds[task.taskId]; // Extract error message for this task

  return (
    <Card className="relative bg-muted/50 transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.tag || 'No tag'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{task.description || 'No description'}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {task.dueDate
            ? `Due: ${format(new Date(task.dueDate), 'EEEE, MMMM d, yyyy')}`
            : 'No due date'}
        </span>
        {/* Uncomment and adjust Avatar as needed */}
        <TooltipProvider>
          <div className="flex -space-x-2">
            {task.assignedUsers && task.assignedUsers.length > 0 ? (
              task.assignedUsers.map((user) => (
                <Tooltip key={user.userId}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-muted/50">
                      <AvatarImage
                        src={
                          user.profilePic
                            ? `/path/to/avatars/${user.profilePic}`
                            : '/path/to/default-avatar.jpg'
                        }
                        alt={user.username || 'Assigned User'}
                      />
                      <AvatarFallback className="text-xs">
                        {user.username
                          ? user.username.charAt(0).toUpperCase()
                          : 'NA'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.username || 'Unnamed User'}</p>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/path/to/default-avatar.jpg"
                  alt="No Assigned User"
                />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipProvider>

        {/* Kebab Menu */}
        <div className="absolute top-2 right-2 flex items-center justify-center">
          <button
            onClick={() => onBookmark(task.taskId, task.isBookmarked)}
            className="flex items-center justify-center p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-blue-500"
            aria-label={task.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            disabled={isLoading}
          >
            {isLoading ? (
              // Spinner
              <span className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
            ) : task.isBookmarked ? (
              <BookmarkFilledIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-500 opacity-30 hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full group transition-colors duration-300 hover:bg-slate-950/30"
                aria-label="More Options"
              >
                <MoreHorizontal className="h-5 w-5 cursor-pointer opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Change Status
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    // Implement handleChangeStatus as needed
                    // onClick={() => handleChangeStatus(task, 'pending')}
                    disabled={task.status === 'pending'}
                  >
                    <Circle className="mr-2 h-4 w-4" />
                    Set to Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    // onClick={() =>
                    //   handleChangeStatus(task, 'in-progress')
                    // }
                    disabled={task.status === 'in-progress'}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Set to In-Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    // onClick={() => handleChangeStatus(task, 'completed')}
                    disabled={task.status === 'completed'}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Set to Completed
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(task.taskId)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
      {/* Display error message if any */}
      {errorMessage && (
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs text-red-500">{errorMessage}</p>
        </div>
      )}
    </Card>
  );
};

export default React.memo(TaskCard);
