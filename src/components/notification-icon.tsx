import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from './ui/badge';

const NotificationIcon = () => {
  return (
    <div className="relative cursor-pointer">
      <Bell className="h-5 w-5 " aria-label="Notifications" />
      <Badge
        variant="destructive"
        className="absolute rounded-full -top-3 -right-3"
      >
        3
      </Badge>
    </div>
  );
};

export default NotificationIcon;
