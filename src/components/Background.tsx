export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
      }}
    >
      <div
        className="blob animate-float"
        style={{
          width: "55vw",
          height: "55vw",
          left: "-10vw",
          top: "-10vw",
          background:
            "radial-gradient(circle at 30% 30%, #f472b6, transparent 60%)",
        }}
      />
      <div
        className="blob animate-drift"
        style={{
          width: "50vw",
          height: "50vw",
          right: "-12vw",
          top: "10vh",
          animationDelay: "-3s",
          background:
            "radial-gradient(circle at 60% 40%, #22d3ee, transparent 60%)",
        }}
      />
      <div
        className="blob animate-float"
        style={{
          width: "60vw",
          height: "60vw",
          left: "10vw",
          bottom: "-20vh",
          animationDelay: "-6s",
          background:
            "radial-gradient(circle at 50% 50%, #c084fc, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
