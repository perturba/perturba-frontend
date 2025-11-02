import Image from "next/image";
import { BiBrain, BiCamera, BiLockAlt } from "react-icons/bi";

export default function InvisibleCloaking() {
    const features = [
        {
            icon: <BiBrain size={46} className="text-indigo-300 drop-shadow-glow" />,
            title: "AI 학습 차단",
            text: "AI 모델이 이미지를 학습하거나 유사 이미지를 생성하지 못하도록 교란합니다.",
        },
        {
            icon: <BiCamera size={46} className="text-blue-300 drop-shadow-glow" />,
            title: "딥페이크 방어",
            text: "얼굴 인식 및 외형 복제를 방지하여 사전 차단합니다.",
        },
        {
            icon: <BiLockAlt size={46} className="text-yellow-400 drop-shadow-glow" />,
            title: "개인정보 보호",
            text: "이미지 속 인물의 프라이버시를 안전하게 지킵니다.",
        },
    ];

    return (
        <section className="h-screen w-screen snap-start flex flex-col items-center justify-center px-6 md:px-12 py-48 relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-black mb-10 z-10 text-slate-100 animate-fade-in-up">
                비가시성 클로킹이란 무엇인가요?
            </h2>
            <p className="text-gray-200 text-center max-w-3xl leading-relaxed mb-16 text-base z-10 animate-fade-in-up">
                비가시성 클로킹은 사진에 <strong className="font-bold text-white">눈에 보이지 않는 보호 신호</strong>를 더해
                <br />
                AI가 이미지를 정확히 인식하거나 오용하지 못하도록 막아주는 기술입니다.
                <br />
                사진을 업로드하면 자동으로 이 보호가 적용되어,
                다양한 AI 오인식·딥페이크로부터 <span className="font-semibold text-indigo-200">내 이미지를 안전하게</span> 지킬 수 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full z-10">
                {features.map((item, i) => (
                    <div
                        key={item.title}
                        className="relative bg-white/10 border border-white/10 backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center gap-6 drop-shadow-xl transition-transform duration-300 will-change-transform hover:scale-105 hover:ring-2 hover:ring-indigo-300 animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.13 + 0.12}s` }}
                    >
                        <div>{item.icon}</div>
                        <h3 className="font-semibold text-base text-slate-100 mt-3">{item.title}</h3>
                        <p className="text-gray-300 text-base text-center leading-snug">{item.text}</p>
                    </div>
                ))}
            </div>

            <Image
                src="/3d_4.png"
                alt="cube"
                width={200}
                height={200}
                className="absolute right-[10%] bottom-[5%] opacity-70 hidden md:block"
            />
        </section>
    );
}
