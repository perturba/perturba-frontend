"use client";

export default function ScrollContainer({ children }: { children: React.ReactNode }) {
    return (
        <main
            className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory"
            style={{ scrollBehavior: "smooth" }}
        >
            {children}
        </main>
    );
}
