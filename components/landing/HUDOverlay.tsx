"use client";

export function HUDOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-10 left-10 w-16 h-16 border-l-2 border-t-2 border-white/10 rounded-tl-2xl" />
      <div className="absolute top-10 right-10 w-16 h-16 border-r-2 border-t-2 border-white/10 rounded-tr-2xl" />
      <div className="absolute bottom-10 left-10 w-16 h-16 border-l-2 border-b-2 border-white/10 rounded-bl-2xl" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-r-2 border-b-2 border-white/10 rounded-br-2xl" />

      {/* Vertical data lines */}
      <div className="absolute top-1/3 left-8 w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block" />
      <div className="absolute bottom-1/3 right-8 w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block" />

      {/* Decorative text */}
      <div className="absolute top-12 right-28 text-[10px] font-mono text-white/15 hidden lg:block tracking-widest">
        SYS.V.2.04 // CONNECTED
      </div>
      <div className="absolute bottom-12 left-28 text-[10px] font-mono text-white/15 hidden lg:block tracking-widest">
        API.GATEWAY // ACTIVE
      </div>
    </div>
  );
}
