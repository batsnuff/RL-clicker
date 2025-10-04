import React, { useState, useEffect } from 'react';

export default function DamageNumber({ damage, isCritical, x, y }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`absolute pointer-events-none z-50 font-bold text-2xl select-none ${
        isCritical ? 'text-yellow-400 animate-bounce' : 'text-red-400'
      }`}
      style={{
        left: x,
        top: y,
        animation: 'damageFloat 1s ease-out forwards'
      }}
    >
      {isCritical ? 'CRIT!' : damage}
    </div>
  );
}
