'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { ITask } from '@models/Task';
import EditTaskDialog from '@components/EditTaskDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  Circle,
  Edit3,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';

export default function Page() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const res = await fetch(`${API_BASE_URL}/tasks`, {
          cache: 'no-store',
        });
        const data = await res.json();
        setTasks(data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleEditClick = (task: ITask) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleMarkComplete = (task: ITask) => {
    const updatedTask = { ...task, status: 'completed' };
    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? updatedTask : t
    );
    // setTasks(updatedTasks);
  };

  const handleSaveTask = (updatedTask: Partial<ITask>) => {
    const updatedTasks = tasks.map((task) =>
      task._id === selectedTask?._id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks as ITask[]);
    setOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="mx-auto w-full rounded-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task: ITask) => (
            <Card
              key={task._id}
              className="relative bg-muted/50 transition-shadow group duration-300 hover:shadow-lg"
            >
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
                    ? `Due: ${format(
                        new Date(task.dueDate),
                        'EEEE, MMMM d, yyyy'
                      )}`
                    : 'No due date'}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      task.assignedTo
                        ? `/path/to/avatars/${task.assignedTo}.jpg`
                        : '/path/to/default-avatar.jpg'
                    }
                    alt="Assigned User"
                  />
                  <AvatarFallback>
                    {task.assignedTo ? `U${task.assignedTo}` : 'NA'}
                  </AvatarFallback>
                </Avatar>
                {/* Kebab Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-2 right-2 ">
                      <MoreVertical className="h-5 w-5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(task)}>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {selectedTask && (
        <EditTaskDialog
          open={open}
          onOpenChange={setOpen}
          selectedTask={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
