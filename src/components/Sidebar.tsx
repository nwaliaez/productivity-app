'use client';
import { cn } from '@lib/client/helpers';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ButtonProps } from '@components/ui/button';
import {
  ClipboardList,
  ClipboardType,
  LayoutDashboard,
  Tag,
} from 'lucide-react';

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  console.log(pathname);

  const getButtonVariant = (route: string): ButtonProps['variant'] =>
    pathname === route ? 'secondary' : 'ghost';

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Home
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button
                variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <LayoutDashboard className="w-4 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Features
          </h2>
          <div className="space-y-1">
            <Link href="/create/task">
              <Button
                variant={getButtonVariant('/create/task')}
                className="w-full justify-start"
              >
                <ClipboardList className="w-4 h-5 mr-2" />
                Create Task
              </Button>
            </Link>
            <Link href="/create/tag">
              <Button
                variant={getButtonVariant('/create/tag')}
                className="w-full justify-start"
              >
                <Tag className="w-4 h-5 mr-2" />
                Create Tag
              </Button>
            </Link>
            <Link href="/create/form">
              <Button
                variant={getButtonVariant('/create/form')}
                className="w-full justify-start"
              >
                <ClipboardType className="w-4 h-5 mr-2" />
                Create Form
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
