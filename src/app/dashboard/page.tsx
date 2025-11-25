"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/image-upload');
    }, [router]);

    return (
        <div className="flex-1 min-h-0 h-screen flex flex-col bg-gray-50">
        </div>
    );
};
