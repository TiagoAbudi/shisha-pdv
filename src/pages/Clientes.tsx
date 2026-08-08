import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';
import { clientesMock } from '../mocks/clientes';

export function Clientes({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  return (
    <TelaSecundaria titulo="👥 Clientes & Fiado (Mock)" aoVoltar={aoVoltar}>
      <div style={{ backgroundColor: cores.bgPainel, padding: '24px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
              <th style={{ padding: '16px 12px', color: cores.textoSecundario, fontWeight: '600' }}>Nome</th>
              <th style={{ color: cores.textoSecundario, fontWeight: '600' }}>CPF</th>
              <th style={{ color: cores.textoSecundario, fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {clientesMock.map(c => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                <td style={{ padding: '16px 12px', fontWeight: '600' }}>{c.nome}</td>
                <td style={{ color: cores.textoSecundario, fontFamily: 'monospace' }}>{c.cpf}</td>
                <td>
                  {c.nome.includes('Fiado') 
                    ? <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px' }}>Com Débitos</span> 
                    : <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>Em Dia</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TelaSecundaria>
  );
}