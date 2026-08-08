import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Lock, MonitorSmartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Login({ aoLogar }: { aoLogar: () => void }) {
  const { cores } = useTheme();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = () => {
    if (usuario === 'admin' && senha === 'admin') aoLogar();
    else alert('Usuário ou senha incorretos! (Dica: admin / admin)');
  };

  useHotkeys('enter', (e) => { e.preventDefault(); fazerLogin(); }, { enableOnFormTags: true });

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: cores.bgGeral, justifyContent: 'center', alignItems: 'center', transition: 'background-color 0.3s' }}>
      <div style={{ backgroundColor: cores.bgPainel, padding: '48px 40px', borderRadius: '16px', border: `1px solid ${cores.borda}`, width: '400px', textAlign: 'center', boxShadow: cores.sombra, transition: 'all 0.3s' }}>
        <div style={{ backgroundColor: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
          <MonitorSmartphone size={40} color="#3b82f6" />
        </div>
        <h2 style={{ color: cores.texto, marginBottom: '8px', fontSize: '24px', fontWeight: '700' }}>Shisha Conveniência</h2>
        <p style={{ color: cores.textoSecundario, marginBottom: '32px', fontSize: '14px' }}>Acesse o sistema de retaguarda</p>
        
        <input 
          autoFocus placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)}
          style={{ width: '100%', padding: '16px', marginBottom: '16px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, fontSize: '16px', outline: 'none' }}
        />
        <input 
          type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)}
          style={{ width: '100%', padding: '16px', marginBottom: '32px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, fontSize: '16px', outline: 'none' }}
        />
        
        <button onClick={fazerLogin} style={{ width: '100%', padding: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 14px 0 rgb(59 130 246 / 39%)' }}>
          Acessar Sistema [ ENTER ]
        </button>
      </div>
    </div>
  );
}