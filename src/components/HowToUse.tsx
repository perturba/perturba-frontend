import { FiUploadCloud, FiShield, FiDownload } from "react-icons/fi";

export default function HowToUse() {
    const steps = [
        {
            icon: <FiUploadCloud size={38} className="text-blue-300 drop-shadow-glow" />,
            title: "1. 이미지 업로드",
            desc: "보호하고 싶은 이미지를 선택해 업로드합니다.",
            ring: "hover:ring-blue-300",
        },
        {
            icon: <FiShield size={38} className="text-purple-300 drop-shadow-glow" />,
            title: "2. AI 자동 교란 처리",
            desc: "눈에 보이지 않는 보호막을 자동으로 생성합니다.",
            ring: "hover:ring-violet-300",
        },
        {
            icon: <FiDownload size={38} className="text-yellow-400 drop-shadow-glow" />,
            title: "3. 안전한 이미지 다운로드",
            desc: "보호된 이미지를 안전하게 저장하세요.",
            ring: "hover:ring-yellow-300",
        },
    ];

    return (
        <section className="h-screen w-screen snap-start flex flex-col items-center justify-center text-center px-6 md:px-12 py-48 relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-black mb-14 tracking-tighter z-10 text-slate-100 animate-fade-in-up">
                어떻게 사용하나요?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full z-10">
                {steps.map((s, i) => (
                    <div
                        key={s.title}
                        className={`relative bg-white/10 border border-white/10 backdrop-blur-xl p-10 rounded-3xl flex flex-col items-center gap-4 drop-shadow-xl transition-transform duration-300 will-change-transform hover:scale-105 hover:ring-2 ${s.ring} animate-fade-in-up`}
                        style={{ animationDelay: `${i * 0.12 + 0.12}s` }}
                    >
                        <div className="flex flex-col items-center gap-2 z-10">
                            {s.icon}
                            <span className="text-xs font-bold text-white/50 tracking-tight mt-1">
                                {s.title}
                            </span>
                        </div>
                        <p className="text-gray-200 text-base font-medium leading-relaxed z-10">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
