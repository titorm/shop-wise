"use client";

import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "@/components/layout/main-nav";
import { Header } from "@/components/layout/header";
import { useRequireAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex h-16 items-center justify-between border-b px-6">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="w-56 border-r p-6">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                </aside>
                <main className="flex-1 p-6">
                    <Skeleton className="h-full w-full" />
                </main>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <MainNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
