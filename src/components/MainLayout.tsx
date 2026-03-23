import { ReactNode } from "react";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <TopBar />
      <main className="ml-64 mt-14 min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </div>
  );
}
