export default function ImageTransformLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row h-full flex-1">
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
