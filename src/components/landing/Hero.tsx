import Image from "next/image";

export default function Hero() {
    return (
        <section className="h-screen w-screen snap-start flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 lg:px-16 py-24 sm:py-32 md:py-48 relative overflow-hidden">
            <Image
                src="/3d_1.png"
                alt="cube"
                width={320}
                height={320}
                className="absolute left-0 top-0 opacity-80 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
            />
            <Image
                src="/3d_2.png"
                alt="chain"
                width={380}
                height={380}
                className="absolute right-4 top-28 sm:right-8 sm:top-12 md:right-12 md:top-20 lg:right-24 lg:top-28 xl:right-72 xl:top-40 opacity-70 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-96 xl:h-96"
            />
            <Image
                src="/3d_3.png"
                alt="sphere"
                width={300}
                height={300}
                className="absolute left-[5%] sm:left-[10%] top-[80%] opacity-70 w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72"
            />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold m-4 sm:m-6 md:m-8 z-10 leading-tight text-white">
                Perturba
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-200 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl z-10 px-4">
                눈에 보이지 않는 클로킹으로 내 이미지를 스마트하게 보호합니다.
            </p>
            <p className="mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl z-10 px-4">
                복잡한 설정 없이 사진을 업로드하면 AI가 오인식하지 못하도록 자동으로 보호가 적용됩니다.
                <br className="hidden sm:block" />
                비교와 강도 조절 기능으로 누구나 쉽게 안전한 이미지 관리가 가능합니다.
            </p>
        </section>
    );
}
