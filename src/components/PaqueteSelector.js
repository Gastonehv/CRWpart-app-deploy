import { useState } from 'react';

// PAQUETES DEMO PREMIUM (idénticos a paquetes.js y editar-festejo.js)
export const PAQUETES = [
  {
    nombre: 'Flow Total',
    icono: '💎',
    descripcion: 'Todo el ambiente premium: decoración, luces, y acceso VIP para ti y tus invitados.',
    beneficios: [
      'Decoración temática premium',
      'Luces inteligentes y efectos',
      'Zona VIP exclusiva',
      'Staff de apoyo dedicado',
    ],
    precio: 3999,
  },
  {
    nombre: 'Summer Pool',
    icono: '🏊‍♂️',
    descripcion: 'Ideal para pool parties: inflables, barra de bebidas, música y más.',
    beneficios: [
      'Inflables y flotadores de diseño',
      'Barra de bebidas refrescante',
      'DJ set con playlist premium',
      'Toallas y amenities premium',
    ],
    precio: 2999,
  },
  {
    nombre: 'Party Starter',
    icono: '🎉',
    descripcion: 'Lo esencial para arrancar tu festejo con flow y cero estrés.',
    beneficios: [
      'Kit de bienvenida para invitados',
      'Snacks y bebidas básicas',
      'Decoración minimalista',
      'Soporte en la organización',
    ],
    precio: 1599,
  },
];

export default function PaqueteSelector({ onChange, paquetes = PAQUETES }) {
  const [cantidades, setCantidades] = useState(paquetes.map(() => 0));

  const total = cantidades.reduce((acc, cant, idx) => acc + cant * paquetes[idx].precio, 0);

  function handleCantidad(idx, val) {
    const next = cantidades.slice();
    next[idx] = Math.max(0, val);
    setCantidades(next);
    if (onChange) onChange(next, total);
  }

  function handlePlus(idx) {
    handleCantidad(idx, cantidades[idx] + 1);
  }
  function handleMinus(idx) {
    handleCantidad(idx, cantidades[idx] - 1);
  }

  function handleCardClick(idx) {
    handlePlus(idx);
  }

  return (
    <div className="rounded-2xl bg-white/90 shadow-lg p-5 border border-blue-100 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-blue-700">Selecciona tus paquetes</h3>
      <div className="space-y-3">
        {paquetes.map((p, idx) => (
          <div key={p.nombre} className="flex items-center justify-between gap-2 group cursor-pointer" onClick={() => handleCardClick(idx)}>
            <span className="font-semibold text-lg text-purple-900">{p.nombre}</span>
            <span className="text-blue-500 font-bold">${p.precio}</span>
            <div className="flex items-center gap-1">
              <button type="button" className="rounded-full bg-gray-200 px-2 py-1 text-lg font-bold hover:bg-blue-200 transition-all" onClick={e => { e.stopPropagation(); handleMinus(idx); }}>-</button>
              <span className="w-8 text-center font-bold text-lg">{cantidades[idx]}</span>
              <button type="button" className="rounded-full bg-gray-200 px-2 py-1 text-lg font-bold hover:bg-blue-200 transition-all" onClick={e => { e.stopPropagation(); handlePlus(idx); }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span className="font-bold text-lg text-gray-700">Total:</span>
        <span className="text-2xl font-extrabold text-green-600">${total}</span>
      </div>
    </div>
  );
}
