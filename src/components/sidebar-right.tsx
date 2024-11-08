import * as React from 'react';
import { Plus } from 'lucide-react';
import { Calendars } from '@components/calendars';
import { DatePicker } from '@components/date-picker';
import { NavUser } from '@components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@components/ui/sidebar';
import { auth } from '../../auth';

// Sample calendars data (you may want to fetch this dynamically as well)
const calendarsData = [
  {
    name: 'My Calendars',
    items: ['Personal', 'Work', 'Family'],
  },
  {
    name: 'Favorites',
    items: ['Holidays', 'Birthdays'],
  },
  {
    name: 'Other',
    items: ['Travel', 'Reminders', 'Deadlines'],
  },
];

export async function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  const user = {
    name: 'Guest',
    email: '',
    avatar: '/avatars/default-avatar.jpg',
  };
  if (session?.user) {
    user.name = String(session.user.name);
    user.email = String(session.user.email);
  }
  // Extract user details from the session

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={calendarsData} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
