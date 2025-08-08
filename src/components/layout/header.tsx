import Link from "next/link";
import { Bell, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <Link href="/dashboard">
            <Logo className="h-7 w-7 text-primary" />
        </Link>
        <span className="text-xl font-bold font-headline">ShopWise</span>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/list">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Lista de Compras Ativa</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
      </div>
    </header>
  );
}
