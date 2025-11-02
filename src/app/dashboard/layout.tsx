import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row h-full flex-1">
            <DashboardSidebar />
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
