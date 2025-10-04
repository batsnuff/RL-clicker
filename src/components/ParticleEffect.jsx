import React, { useState, useEffect } from 'react';

export default function ParticleEffect({ type, x, y, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = type === 'craft' ? 8 : 5;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        life: 1,
        decay: 0.02 + Math.random() * 0.01
      });
    }

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - particle.decay
        })).filter(particle => particle.life > 0);

        if (updated.length === 0) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }

        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [type, x, y, onComplete]);

  return (
    <div className="absolute pointer-events-none z-40">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full ${
            type === 'craft' ? 'bg-yellow-400' : 'bg-purple-400'
          }`}
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life,
            transform: `scale(${particle.life})`
          }}
        />
      ))}
    </div>
  );
}
