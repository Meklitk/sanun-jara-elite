import { Outlet } from "react-router-dom";

import SidebarNav from "@/components/SidebarNav";
import TopBar from "@/components/TopBar";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.2]"
        style={{ backgroundImage: "url(/images/manden-texture-dark.png)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--gold)/0.1),transparent_35%),radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_30%),linear-gradient(180deg,hsl(var(--background)/0.96),hsl(var(--background)))]"
        aria-hidden
      />

      <div className="relative z-10">
        <TopBar />

        <div className="mx-auto flex max-w-[1700px] gap-4 px-3 pb-10 pt-4 sm:pt-6 sm:px-4 lg:px-6 xl:gap-6">
          <SidebarNav mode="desktop" />

          <main className="relative min-w-0 flex-1 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
