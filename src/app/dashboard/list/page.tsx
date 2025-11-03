import TransformLogTable from "@/components/TransformLogTable";

export default function ImageListPage() {
    return (
        <div className="flex-1 min-h-0 flex flex-col bg-gray-50 py-10 px-8 gap-16">
            <div>
                <span className="text-gray-900 text-2xl font-bold">변환된 이미지 목록</span>

                <TransformLogTable />
            </div>
        </div>
    );
};