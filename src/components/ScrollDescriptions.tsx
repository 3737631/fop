interface Props {
  progress: number;
  visible: boolean;
}

const items = [
  {
    key: 'material',
    text: 'Cristal soplado a mano sobre una base de arena del desierto del Sáhara, cocido a 1200°C.',
    align: 'left' as const,
  },
  {
    key: 'artesania',
    text: 'Cada pieza requiere 72 horas de trabajo artesanal en nuestro taller de Marrakech.',
    align: 'right' as const,
  },
  {
    key: 'tecnologia',
    text: 'Tecnología LED de espectro completo con regulación táctil integrada.',
    align: 'left' as const,
  },
  {
    key: 'exclusividad',
    text: 'Edición limitada: solo 99 unidades al año, numeradas y firmadas.',
    align: 'right' as const,
  },
];

export default function ScrollDescriptions({ progress, visible }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none hidden lg:block">
      <div className="relative w-full h-full max-w-7xl mx-auto px-8">
        {items.map((item, i) => {
          const triggerStart = i * 0.25;
          const triggerEnd = triggerStart + 0.25;
          const clamped = Math.max(0, Math.min(1, (progress - triggerStart) / (triggerEnd - triggerStart)));
          const opacity = clamped;
          const xOffset = item.align === 'left' ? -10 : 10;

          return (
            <div
              key={item.key}
              className={`absolute top-1/4 ${item.align === 'left' ? 'left-8' : 'right-8'}`}
              style={{
                top: `${22 + i * 12}%`,
                opacity,
                transform: `translateX(${(1 - opacity) * xOffset}px)`,
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
              }}
            >
              <div
                className={`max-w-[200px] ${item.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                <p className="text-xs leading-relaxed text-white/30 font-light">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
