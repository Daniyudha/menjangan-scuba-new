// src/app/(admin)/layout.tsx
import Sidebar from "./admin/(components)/Sidebar"; 
import AdminHeader from "./admin/(components)/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 text-dark-navy overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}