import { Navbar } from './Navigation/Navbar';
import { Sidebar } from './Navigation/Sidebar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="layout-right">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
