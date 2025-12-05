export default function Background() {
    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#18206f] via-[#241c35] to-[#190f2f] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-[#201a40] to-gray-950 opacity-85 mix-blend-hard-light" />

            <div className="absolute -top-36 sm:-top-48 md:-top-72 -left-36 sm:-left-48 md:-left-72 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] bg-[radial-gradient(circle_at_center,_rgba(60,112,255,0.28),_transparent_70%)] blur-[120px] sm:blur-[150px] md:blur-[180px] rounded-full drop-shadow-xl" />

            <div className="absolute bottom-0 right-0 w-[440px] h-[400px] sm:w-[660px] sm:h-[600px] md:w-[880px] md:h-[800px] bg-[radial-gradient(circle_at_center,_rgba(255,200,67,0.18),_transparent_80%)] blur-[120px] sm:blur-[150px] md:blur-[180px] rounded-full" />

            <div className="absolute bottom-24 sm:bottom-32 md:bottom-36 left-[15%] sm:left-[20%] md:left-1/4 w-[280px] h-[210px] sm:w-[420px] sm:h-[315px] md:w-[560px] md:h-[420px] bg-[radial-gradient(circle_farthest-side,_rgba(160,69,255,0.18),_transparent_80%)] blur-[100px] sm:blur-[120px] md:blur-[140px] rounded-full opacity-90" />

            <div className="pointer-events-none absolute inset-0 z-0 opacity-15 select-none"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,rgba(185,194,255,0.06) 1px,transparent 1px),linear-gradient(180deg,rgba(185,194,255,0.06) 1px,transparent 1px)",
                    backgroundSize: "24px 24px sm:32px sm:32px"
                }} />

            <div className="absolute top-28 sm:top-36 md:top-40 left-[25%] sm:left-[28%] md:left-[30%] w-[240px] h-[165px] sm:w-[360px] sm:h-[248px] md:w-[480px] md:h-[330px] bg-[radial-gradient(circle_at_center,_rgba(255,255,247,0.16),_transparent_70%)] blur-[48px] sm:blur-[60px] md:blur-[72px] rounded-full opacity-70 animate-pulse" />
        </div>
    );
}