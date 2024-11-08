// components/BreadcrumbHeader.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/ui/breadcrumb';
import { Separator } from '@components/ui/separator';
import { SidebarTrigger } from '@components/ui/sidebar';
import React from 'react';

// Define the types of breadcrumb items
export interface Breadcrumb {
  title: string;
  href?: string; // Make href optional
}

interface BreadcrumbHeaderProps {
  breadcrumbs: Breadcrumb[];
}

const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({ breadcrumbs }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <>
                <BreadcrumbItem key={index} className="hidden md:block">
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default BreadcrumbHeader;
