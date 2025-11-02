export default function Background() {
    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#18206f] via-[#241c35] to-[#190f2f] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-[#201a40] to-gray-950 opacity-85 mix-blend-hard-light" />

            <div className="absolute -top-72 -left-72 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,_rgba(60,112,255,0.28),_transparent_70%)] blur-[180px] rounded-full drop-shadow-xl" />

            <div className="absolute bottom-0 right-0 w-[880px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(255,200,67,0.18),_transparent_80%)] blur-[180px] rounded-full" />

            <div className="absolute bottom-36 left-1/4 w-[560px] h-[420px] bg-[radial-gradient(circle_farthest-side,_rgba(160,69,255,0.18),_transparent_80%)] blur-[140px] rounded-full opacity-90" />

            <div className="pointer-events-none absolute inset-0 z-0 opacity-15 select-none"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,rgba(185,194,255,0.06) 1px,transparent 1px),linear-gradient(180deg,rgba(185,194,255,0.06) 1px,transparent 1px)",
                    backgroundSize: "32px 32px"
                }} />

            <div className="absolute top-40 left-[30%] w-[480px] h-[330px] bg-[radial-gradient(circle_at_center,_rgba(255,255,247,0.16),_transparent_70%)] blur-[72px] rounded-full opacity-70 animate-pulse" />
        </div>
    );
}
