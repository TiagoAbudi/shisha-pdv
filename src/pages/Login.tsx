import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { MonitorSmartphone, X, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Login({ aoLogar }: { aoLogar: () => void }) {
  const { cores } = useTheme();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  // Estado para controlar o modal de alerta
  const [alertaAberto, setAlertaAberto] = useState(false);

  const fazerLogin = () => {
    if (usuario === 'admin' && senha === 'admin') {
      aoLogar();
    } else {
      setAlertaAberto(true);
    }
  };

  // Se o alerta estiver aberto, o ENTER e o ESC apenas fecham ele. 
  // Se não estiver, o ENTER tenta fazer o login.
  useHotkeys('enter', (e) => {
    e.preventDefault();
    if (alertaAberto) setAlertaAberto(false);
    else fazerLogin();
  }, { enableOnFormTags: true });

  useHotkeys('esc', (e) => {
    if (alertaAberto) {
      e.preventDefault();
      setAlertaAberto(false);
    }
  }, { enableOnFormTags: true });

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: cores.bgGeral, justifyContent: 'center', alignItems: 'center', transition: 'background-color 0.3s', position: 'relative' }}>

      <div style={{ backgroundColor: cores.bgPainel, padding: '48px 40px', borderRadius: '16px', border: `1px solid ${cores.borda}`, width: '400px', textAlign: 'center', boxShadow: cores.sombra, transition: 'all 0.3s' }}>
        <div style={{ backgroundColor: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
          <MonitorSmartphone size={40} color="#3b82f6" />
        </div>
        <h2 style={{ color: cores.texto, marginBottom: '8px', fontSize: '24px', fontWeight: '700' }}>Shisha Conveniência</h2>
        <p style={{ color: cores.textoSecundario, marginBottom: '32px', fontSize: '14px' }}>Acesse o sistema de retaguarda</p>

        <input
          autoFocus
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ width: '100%', padding: '16px', marginBottom: '16px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, fontSize: '16px', outline: 'none' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: '100%', padding: '16px', marginBottom: '32px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, fontSize: '16px', outline: 'none' }}
        />

        <button onClick={fazerLogin} style={{ width: '100%', padding: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 14px 0 rgb(59 130 246 / 39%)' }}>
          Acessar Sistema [ ENTER ]
        </button>
      </div>

      {/* MODAL DE ALERTA DE ERRO */}
      {alertaAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={24} color="#ef4444" />
                <h3 style={{ margin: 0, color: cores.texto }}>Acesso Negado</h3>
              </div>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={() => setAlertaAberto(false)} />
            </div>

            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              Usuário ou senha incorretos!<br /><br />
              (Dica: admin / admin)
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAlertaAberto(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Tentar Novamente
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}