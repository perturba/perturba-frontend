import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import TransformStatusModal from "./TransformStatusModal";

export default function TransformStatusButton() {
    const [showStatus, setShowStatus] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                className="w-10 h-10 p-2 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
                aria-label="변환 진행 상태"
                onClick={() => setShowStatus((v) => !v)}
            >
                <BiDotsVerticalRounded size={24} color="white" />
            </button>
            {showStatus && (
                <TransformStatusModal
                    files={[
                        { fileName: "example.jpeg", status: "processing" },
                        { fileName: "example.jpeg", status: "done" }
                    ]}
                />
            )}
        </div>
    );
}
