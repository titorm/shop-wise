
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, useSidebar } from "@/components/ui/sidebar";
import { MainNav } from "@/components/layout/main-nav";
import { Header } from "@/components/layout/header";
import { useRequireAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex h-16 items-center justify-between border-b px-6 bg-card">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="w-56 border-r p-6 bg-card">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                </aside>
                <main className="flex-1 p-6 bg-background">
                    <Skeleton className="h-full w-full" />
                </main>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  return (
    <>
      <Header />
      <Sidebar>
          <MainNav />
      </Sidebar>
      <main className={cn(
          "flex-1 bg-background transition-[margin-left] duration-300 ease-in-out p-4 md:p-6 lg:p-8 pt-20",
          state === 'expanded' ? "md:ml-[var(--sidebar-width)]" : "md:ml-[var(--sidebar-width-icon)]" 
      )}>
          <div className="mx-auto w-full max-w-[1200px]">
            {children}
          </div>
      </main>
    </>
  );
}
