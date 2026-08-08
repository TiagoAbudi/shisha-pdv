import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';

export function Notas({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  return (
    <TelaSecundaria titulo="📄 Notas Fiscais - NFC-e (Mock)" aoVoltar={aoVoltar}>
      <div style={{ backgroundColor: cores.bgPainel, padding: '24px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
        <p style={{ marginBottom: '24px', color: cores.textoSecundario, fontWeight: '500' }}>Listagem das últimas vendas e status de sincronização com a SEFAZ.</p>
        
        <div style={{ padding: '20px', border: `1px solid ${cores.borda}`, borderRadius: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', backgroundColor: cores.bgGeral, alignItems: 'center' }}>
          <span style={{ fontWeight: '600' }}>Venda #00123 <span style={{ color: cores.textoSecundario, fontWeight: 'normal', marginLeft: '8px' }}>R$ 45,00</span></span>
          <span style={{ color: '#10b981', fontWeight: '700', padding: '6px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', fontSize: '13px' }}>Autorizada</span>
        </div>
        
        <div style={{ padding: '20px', border: `1px solid ${cores.borda}`, borderRadius: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', backgroundColor: cores.bgGeral, alignItems: 'center' }}>
          <span style={{ fontWeight: '600' }}>Venda #00124 <span style={{ color: cores.textoSecundario, fontWeight: 'normal', marginLeft: '8px' }}>R$ 119,90</span></span>
          <span style={{ color: '#f59e0b', fontWeight: '700', padding: '6px 12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '20px', fontSize: '13px' }}>Offline (Contingência)</span>
        </div>
      </div>
    </TelaSecundaria>
  );
}