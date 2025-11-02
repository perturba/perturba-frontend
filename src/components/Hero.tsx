import Image from "next/image";

export default function Hero() {
    return (
        <section className="h-screen w-screen snap-start flex flex-col items-center justify-center text-center px-6 md:px-12 py-48 relative">
            <Image
                src="/3d_1.png"
                alt="cube"
                width={320}
                height={320}
                className="absolute left-0 top-0 hidden md:block opacity-80"
            />
            <Image
                src="/3d_2.png"
                alt="chain"
                width={380}
                height={380}
                className="absolute right-72 top-40 hidden md:block opacity-70"
            />
            <Image
                src="/3d_3.png"
                alt="sphere"
                width={300}
                height={300}
                className="absolute left-[10%] top-[100%] opacity-70"
            />

            <h1 className="text-6xl md:text-8xl font-bold m-8 z-1">Perturba</h1>
            <p className="text-xl md:text-2xl font-medium text-gray-200 max-w-3xl z-1">
                눈에 보이지 않는 클로킹으로 내 이미지를 스마트하게 보호합니다.
            </p>
            <p className="mt-6 text-gray-300 leading-relaxed max-w-2xl z-1">
                복잡한 설정 없이 사진을 업로드하면 AI가 오인식하지 못하도록 자동으로 보호가 적용됩니다.
                <br />
                비교와 강도 조절 기능으로 누구나 쉽게 안전한 이미지 관리가 가능합니다.
            </p>
        </section>
    );
}
