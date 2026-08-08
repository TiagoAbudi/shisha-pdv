import { useHotkeys } from 'react-hotkeys-hook';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  titulo: string;
  aoVoltar: () => void;
  children: React.ReactNode;
}

export function TelaSecundaria({ titulo, aoVoltar, children }: Props) {
  const { cores } = useTheme();
  useHotkeys('esc', (e) => { e.preventDefault(); aoVoltar(); });
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: cores.bgPainel, borderBottom: `1px solid ${cores.borda}` }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{titulo}</h2>
        <button onClick={aoVoltar} style={{ padding: '10px 16px', backgroundColor: cores.bgInput, color: cores.texto, border: `1px solid ${cores.bordaForte}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', boxShadow: cores.sombra }}>
          <ArrowLeft size={16} /> Voltar [ ESC ]
        </button>
      </header>
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}