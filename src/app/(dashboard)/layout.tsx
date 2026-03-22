import { React } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Properties', href: '/dashboard/properties' },
    { title: 'Leads', href: '/dashboard/leads' },
    { title: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
   /section className="{-mx-6 w-64 bg-white shadow-lg py-8 px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-500">TenerifeHomes</h1>
   //p>
   //div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
           // href={item.href}
           // className={pathname === item.href ? 'bg-brand-50 text-brand-600 px-4 py-2 rounded block ' : 'text-gray-700 hover:bg-gray-50 px-4 py-2 rounded block"}
            >
   // {item.title}
            </Link>
          ))}
   //nav>
      </div>
   /section>
      <main className="flex-1 overflow-y-auto p-8">
   /header className="mb-8">
   // Add header content here
        </header>
        {children}
      </main>
    </div>
  (};
}