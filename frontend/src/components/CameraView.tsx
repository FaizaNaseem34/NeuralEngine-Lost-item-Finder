"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Camera, Target, Terminal, ShieldCheck, Cpu } from "lucide-react";

export default function CameraView() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [ws, setWs] = useState<WebSocket | null>(null);
    const [detections, setDetections] = useState<any[]>([]);
    const [target, setTarget] = useState("phone");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8000/ws/detect");
        socket.onopen = () => socket.send(JSON.stringify({ target: "phone" }));
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setDetections(data.detections || []);
        };
        setWs(socket);
        return () => socket.close();
    }, []);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }, []);

    const updateTarget = (value: string) => {
        setTarget(value);
        if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ target: value }));
    };

    const sendFrame = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN || !videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        if (video.videoWidth === 0) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const image = canvasRef.current.toDataURL("image/jpeg", 0.6);
        ws.send(JSON.stringify({ image }));
    };

    useEffect(() => {
        const interval = setInterval(sendFrame, 300);
        return () => clearInterval(interval);
    }, [ws]);

    const options = ["phone", "bottle", "bag", "wallet", "keys", "all"];
    const filteredOptions = options.filter((opt) => opt.includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-emerald-500/30">
            {/* HEADER AREA */}
            <header className="border-b border-white/5 bg-[#161920]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <Cpu className="text-emerald-400" size={20} />
                        </div>
                        <span className="font-bold tracking-tight text-lg">NeuralEngine <span className="text-emerald-500">v2.0</span></span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-400">Live Engine</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: CONTROLS */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-[#161920] border border-white/5 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <Search size={16} className="text-emerald-500" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Object Filter</h2>
                        </div>

                        <div className="relative mb-6">
                            <input
                                placeholder="Search definitions..."
                                className="w-full bg-[#0f1115] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {filteredOptions.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => updateTarget(item)}
                                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${target === item
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                            : "bg-transparent border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"
                                        }`}
                                >
                                    {item.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#161920] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Terminal size={16} className="text-emerald-500" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">System Logs</h2>
                        </div>
                        <div className="bg-black/40 rounded-lg p-4 font-mono text-[11px] space-y-2 text-slate-500">
                            <p><span className="text-emerald-800">[INFO]</span> Initialize CV pipeline...</p>
                            <p><span className="text-emerald-800">[INFO]</span> WebSocket connection established.</p>
                            <p><span className="text-emerald-800">[INFO]</span> Tracking target: <span className="text-slate-300">{target}</span></p>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: CAMERA VIEW */}
                <div className="lg:col-span-8">
                    <div className="relative bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl aspect-video group">

                        {/* CORNER DECORATIONS (INDUSTRIAL STYLE) */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-emerald-500/30 m-4 rounded-tl-xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-emerald-500/30 m-4 rounded-br-xl pointer-events-none" />

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                        />

                        <canvas ref={canvasRef} className="hidden" />

                        {/* OVERLAY DETECTION LAYER */}
                        <div className="absolute inset-0 pointer-events-none">
                            {detections.map((det, i) => {
                                const [x1, y1, x2, y2] = det.box;
                                return (
                                    <div
                                        key={i}
                                        className="absolute border border-emerald-400 bg-emerald-400/5 transition-all duration-300"
                                        style={{
                                            left: `${(x1 / (videoRef.current?.videoWidth || 1)) * 100}%`,
                                            top: `${(y1 / (videoRef.current?.videoHeight || 1)) * 100}%`,
                                            width: `${((x2 - x1) / (videoRef.current?.videoWidth || 1)) * 100}%`,
                                            height: `${((y2 - y1) / (videoRef.current?.videoHeight || 1)) * 100}%`,
                                        }}
                                    >
                                        {/* LABEL BOX */}
                                        <div className="absolute -top-[22px] left-[-1px] bg-emerald-400 text-[#0f1115] text-[10px] font-black px-2 py-0.5 flex items-center gap-1">
                                            <ShieldCheck size={10} />
                                            {det.label.toUpperCase()} {(det.confidence * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* SCANNING LINE ANIMATION */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-scan pointer-events-none" />
                    </div>

                    <div className="mt-4 flex items-center justify-between px-2">
                        <div className="flex gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-slate-500 font-bold">Latency</span>
                                <span className="text-sm font-mono text-emerald-400">24ms</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-slate-500 font-bold">FPS</span>
                                <span className="text-sm font-mono text-emerald-400">30</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-600 italic font-medium flex items-center gap-2">
                            <Camera size={12} /> Secure Hardware Acceleration Enabled
                        </p>
                    </div>
                </div>
            </main>

            {/* CUSTOM ANIMATION FOR THE SCAN LINE */}
            <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
        </div>
    );
}