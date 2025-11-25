export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 min-h-0 flex flex-col">
            {children}
        </div>
    );
}