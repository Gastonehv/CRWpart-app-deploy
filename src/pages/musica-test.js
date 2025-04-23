import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MusicaTest() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');

  // Cambia este ID por el de un festejo tuyo
  const festejoId = '82b74bbe-6792-4f8e-933e-791940dfacb8'; // ID ejemplo, cámbialo por el de tu evento si es otro

  const guardarMusica = async () => {
    setStatus('Guardando...');
    if (!festejoId) {
      setStatus('Pon el ID de un festejo tuyo en el código.');
      return;
    }
    const { error } = await supabase
      .from('festejos')
      .update({ musica_favorita: [input] })
      .eq('id', festejoId);
    if (error) {
      setStatus('Error: ' + error.message);
    } else {
      setStatus('¡Guardado con éxito!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001' }}>
      <h2>Prueba mínima de música</h2>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Canción o género"
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
      />
      <button
        onClick={guardarMusica}
        style={{ width: '100%', padding: 10, borderRadius: 8, background: '#38bdf8', color: '#fff', fontWeight: 'bold', border: 'none' }}
      >
        Guardar en festejo
      </button>
      <div style={{ marginTop: 16, color: '#333' }}>{status}</div>
      <p style={{ fontSize: 12, marginTop: 24 }}>Pon el ID de un festejo tuyo en la variable <b>festejoId</b> en el código.</p>
    </div>
  );
}
