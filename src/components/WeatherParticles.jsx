import { useMemo } from 'react';

export default function WeatherParticles({ condition }) {
  // Generăm particulele o singură dată pentru a nu suprasolicita procesorul
  const particles = useMemo(() => {
    const count = 50; // Numărul de picături/fulgi
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * (condition === 'Rain' ? 0.5 : 3) + (condition === 'Rain' ? 0.5 : 2)}s`,
      delay: `${Math.random() * 5}s`,
      size: condition === 'Snow' ? `${Math.random() * 5 + 2}px` : '2px'
    }));
  }, [condition]);

  if (!['Rain', 'Snow', 'Drizzle'].includes(condition)) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={condition === 'Snow' ? 'snow-flake' : 'rain-drop'}
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            width: p.size,
            height: condition === 'Snow' ? p.size : '80px',
          }}
        />
      ))}
    </div>
  );
}