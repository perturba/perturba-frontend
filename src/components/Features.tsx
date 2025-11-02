import { BiShieldQuarter, BiBarChartSquare, BiCloudUpload, BiUserVoice } from "react-icons/bi";

export default function Features() {
    const list = [
        {
            icon: <BiShieldQuarter size={32} className="text-violet-400 drop-shadow-glow" />,
            title: "비가시적 이미지 보호",
            desc: "육안으로는 거의 차이가 없지만, AI 모델은 완전히 다르게 인식하도록 설계된 교란 기술로 이미지를 보호합니다.",
        },
        {
            icon: <BiBarChartSquare size={32} className="text-blue-300 drop-shadow-glow" />,
            title: "실시간 성능 가시화",
            desc: "변환 전후 이미지를 비교하고, AI가 어떻게 인식하는지 직관적으로 확인할 수 있습니다.",
        },
        {
            icon: <BiCloudUpload size={32} className="text-yellow-400 drop-shadow-glow" />,
            title: "Open API 제공",
            desc: "REST API를 제공하여 다른 플랫폼에서도 쉽게 통합이 가능합니다.",
        },
        {
            icon: <BiUserVoice size={32} className="text-gray-200 drop-shadow-glow" />,
            title: "사용자 친화적 인터페이스",
            desc: "누구나 쉽게 이미지를 보호할 수 있도록 직관적으로 구성되어 있습니다.",
        },
    ];

    return (
        <section className="h-screen w-screen snap-start flex flex-col items-center justify-center px-6 md:px-12 py-48 relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-black mb-14 tracking-tighter z-10 text-slate-100 animate-fade-in-up">
                Perturba의 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full z-10">
                {list.map((f, i) => (
                    <div
                        key={f.title}
                        className={`relative bg-white/10 border border-white/10 backdrop-blur-xl p-10 rounded-3xl flex flex-row items-start gap-5 drop-shadow-xl transition-transform duration-300 will-change-transform hover:scale-105 hover:ring-2 hover:ring-indigo-400 animate-fade-in-up`}
                        style={{ animationDelay: `${i * 0.11 + 0.14}s` }}
                    >
                        <div className="flex flex-col items-center mt-1 mr-2">
                            {f.icon}
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold mb-2 text-slate-100">{f.title}</h3>
                            <p className="text-gray-300 text-sm">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
