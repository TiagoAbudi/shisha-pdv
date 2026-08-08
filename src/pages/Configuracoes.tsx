import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';

export function Configuracoes({ aoVoltar }: { aoVoltar: () => void }) {
  const { temaEscuro, toggleTema, cores } = useTheme();

  return (
    <TelaSecundaria titulo="⚙️ Configurações Gerais" aoVoltar={aoVoltar}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* CARD DE APARÊNCIA */}
        <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
            {temaEscuro ? <Moon size={24} color="#3b82f6" /> : <Sun size={24} color="#f59e0b" />} 
            Aparência do Sistema
          </h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '20px', border: `1px solid ${cores.bordaForte}`, borderRadius: '12px', backgroundColor: cores.bgGeral, transition: 'all 0.2s' }}>
            <input type="checkbox" checked={temaEscuro} onChange={toggleTema} style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#3b82f6' }} /> 
            <div>
              <span style={{ fontWeight: '700', fontSize: '16px', display: 'block' }}>Ativar Tema Escuro</span>
              <span style={{ color: cores.textoSecundario, fontSize: '13px' }}>Ideal para turnos da noite/madrugada</span>
            </div>
          </label>
        </div>

        {/* CARD DE DADOS FISCAIS */}
        <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
          <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>Integrações</h3>
          
          <label style={{ display: 'block', marginBottom: '16px', fontWeight: '600', color: cores.textoSecundario }}>
            Token API (FocusNFe):
            <input disabled type="password" value="token_simulado_12345" style={{ width: '100%', padding: '16px', marginTop: '8px', backgroundColor: cores.bgGeral, color: cores.textoSecundario, border: `1px solid ${cores.bordaForte}`, borderRadius: '8px', outline: 'none' }} />
          </label>
          
          <div style={{ marginTop: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: cores.textoSecundario, marginBottom: '12px' }}>
              <input type="checkbox" checked disabled style={{ width: '18px', height: '18px' }} /> Sincronizar estoque nuvem (Supabase)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: cores.textoSecundario }}>
              <input type="checkbox" checked disabled style={{ width: '18px', height: '18px' }} /> Modo Offline-First (SQLite) Ativo
            </label>
          </div>
        </div>

      </div>
    </TelaSecundaria>
  );
}