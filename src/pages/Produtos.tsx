import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';
import { produtosMock } from '../mocks/produtos';

export function Produtos({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  return (
    <TelaSecundaria titulo="📦 Produtos & Estoque (Mock)" aoVoltar={aoVoltar}>
      <div style={{ backgroundColor: cores.bgPainel, padding: '24px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
              <th style={{ padding: '16px 12px', color: cores.textoSecundario, fontWeight: '600' }}>Código</th>
              <th style={{ color: cores.textoSecundario, fontWeight: '600' }}>Nome</th>
              <th style={{ color: cores.textoSecundario, fontWeight: '600' }}>Categoria</th>
              <th style={{ color: cores.textoSecundario, fontWeight: '600' }}>Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtosMock.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                <td style={{ padding: '16px 12px', fontFamily: 'monospace', color: cores.textoSecundario }}>{p.codigoBarras}</td>
                <td style={{ fontWeight: '500' }}>{p.nome}</td>
                <td style={{ color: cores.textoSecundario }}>{p.categoria}</td>
                <td style={{ color: '#10b981', fontWeight: '700' }}>R$ {p.preco.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TelaSecundaria>
  );
}