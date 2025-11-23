import React, { useState } from 'react';
import { StaggeredMenu } from './StaggeredMenu';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="flex h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <StaggeredMenu />
      </div>
      {/* Mobile navigation */}
      <MobileNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>;
}