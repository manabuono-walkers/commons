import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <AdminSidebar />
      <main className="flex-1 ml-[220px] min-h-screen overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
