import AdminSidebar from "@/components/AdminSidebar";
import { AdminAreaProvider } from "@/components/AdminAreaContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAreaProvider>
      <div className="flex min-h-screen bg-[var(--color-bg)]">
        <AdminSidebar />
        <main className="flex-1 md:ml-[220px] min-h-screen overflow-x-auto">
          {children}
        </main>
      </div>
    </AdminAreaProvider>
  );
}
