interface Props {
  progress: number;
}

export default function HeroSection({ progress }: Props) {
  const opacity = Math.max(0, 1 - progress * 2);
  const yOffset = 20 * (1 - opacity);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 pointer-events-none"
      style={{
        opacity,
        transform: `translateY(${yOffset}px)`,
        transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
      }}
    >
      <div className="max-w-4xl mx-auto px-6 pt-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-luxe-gold/60 mb-3 font-light">
          Artesanía en Luz
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-balance leading-tight">
          La Bombilla
          <br />
          <span className="italic font-light text-white/50">de Arena</span>
        </h1>
        <p className="mt-4 text-sm text-white/30 max-w-md mx-auto font-light tracking-wide">
          Donde la luz encuentra la forma más pura de la materia
        </p>
      </div>
    </div>
  );
}
