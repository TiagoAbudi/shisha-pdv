import { Moon, Sun, Building2, Printer, ShieldCheck, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';

export function Configuracoes({ aoVoltar }: { aoVoltar: () => void }) {
  const { temaEscuro, toggleTema, cores } = useTheme();

  return (
    <TelaSecundaria titulo="⚙️ Configurações Gerais" aoVoltar={aoVoltar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingBottom: '24px' }}>
        
        {/* LINHA 1: Aparência e Impressão */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* CARD DE APARÊNCIA */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' }}>
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

          {/* CARD DE IMPRESSÃO */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' }}>
              <Printer size={24} color="#10b981" /> 
              Impressão Térmica
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario, fontWeight: '600' }}>Impressora Padrão (Cupom)</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgGeral, color: cores.texto, outline: 'none' }}>
                  <option>EPSON TM-T20X Receipt</option>
                  <option>Elgin i9</option>
                  <option>Bematech MP-4200</option>
                  <option>Salvar em PDF</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: cores.textoSecundario, fontSize: '14px' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#10b981' }} /> Imprimir recibo automaticamente após venda
              </label>
            </div>
          </div>

        </div>

        {/* LINHA 2: Empresa e Integrações */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          
          {/* CARD DADOS DA EMPRESA E ENDEREÇO */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' }}>
              <Building2 size={24} color="#8b5cf6" /> 
              Dados da Empresa (Emissor NFC-e)
            </h3>
            
            {/* Informações Fiscais Básicas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Razão Social</label>
                <input type="text" defaultValue="Shisha Conveniência LTDA" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Nome Fantasia</label>
                <input type="text" defaultValue="Shisha Conveniência" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>CNPJ</label>
                <input type="text" defaultValue="00.000.000/0001-00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Inscrição Estadual (IE)</label>
                <input type="text" defaultValue="123456789" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
            </div>

            {/* Divisória */}
            <div style={{ height: '1px', backgroundColor: cores.borda, margin: '32px 0 24px 0' }} />

            <h4 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: cores.texto }}>
              <MapPin size={20} color="#f59e0b" /> Endereço da Sede
            </h4>

            {/* Informações de Endereço */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>CEP</label>
                <input type="text" defaultValue="87000-000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Logradouro (Rua/Avenida)</label>
                <input type="text" defaultValue="Avenida Brasil" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Número</label>
                <input type="text" defaultValue="1000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Bairro</label>
                <input type="text" defaultValue="Centro" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>Cidade</label>
                <input type="text" defaultValue="Maringá" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: cores.textoSecundario }}>UF</label>
                <input type="text" defaultValue="PR" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Salvar Dados Fiscais
              </button>
            </div>
          </div>

          {/* CARD DE INTEGRAÇÕES */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, alignSelf: 'start' }}>
            <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' }}>
              <ShieldCheck size={24} color="#ec4899" /> 
              Integrações e Nuvem
            </h3>
            
            <label style={{ display: 'block', marginBottom: '24px', fontWeight: '600', color: cores.textoSecundario, fontSize: '14px' }}>
              Token API (FocusNFe):
              <input disabled type="password" value="token_simulado_12345" style={{ width: '100%', padding: '12px', marginTop: '8px', backgroundColor: cores.bgGeral, color: cores.textoSecundario, border: `1px solid ${cores.bordaForte}`, borderRadius: '8px', outline: 'none' }} />
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: cores.textoSecundario, fontSize: '14px' }}>
                <input type="checkbox" checked disabled style={{ width: '18px', height: '18px' }} /> Sincronizar com Supabase (Nuvem)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: cores.textoSecundario, fontSize: '14px' }}>
                <input type="checkbox" checked disabled style={{ width: '18px', height: '18px' }} /> Modo Offline-First (SQLite) Ativo
              </label>
            </div>
          </div>

        </div>

      </div>
    </TelaSecundaria>
  );
}