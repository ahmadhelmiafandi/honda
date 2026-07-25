
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar />
            {/* Desktop: offset for sidebar. Mobile: offset for top bar + bottom nav */}
            <main className="flex-grow md:ml-64 pt-14 md:pt-0 pb-16 md:pb-0 p-4 md:p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}
