import { Outlet } from 'react-router-dom';
import Header from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="bg-betano-dark text-betano-text min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
