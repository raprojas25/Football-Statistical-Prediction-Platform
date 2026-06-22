import { Outlet } from 'react-router-dom';
import Header from './Navbar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-200 dark:bg-betano-dark dark:text-white">
      <Topbar />
      <Header />
      <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
