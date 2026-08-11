import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { FileText, Search, ArrowLeft, RefreshCw, XCircle, FileOutput } from 'lucide-react';

const mockInicial = [
  { id: 1, num: '000123', data: '11/08/2026 08:10', cliente: 'Consumidor Final', valor: 45.00, status: 'Autorizada' },
  { id: 2, num: '000124', data: '11/08/2026 08:25', cliente: 'João Silva', valor: 119.90, status: 'Offline (Contingência)' },
  { id: 3, num: '000125', data: '10/08/2026 18:45', cliente: 'Consumidor Final', valor: 12.50, status: 'Cancelada' },
];

export function Notas({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  const [busca, setBusca] = useState('');
  const [listaNotas, setListaNotas] = useState(mockInicial);

  useHotkeys('esc', (e) => {
    e.preventDefault();
    aoVoltar();
  });

  // Filtra as notas pelo número, nome do cliente ou status
  const notasFiltradas = listaNotas.filter(nota =>
    nota.num.includes(busca) ||
    nota.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    nota.status.toLowerCase().includes(busca.toLowerCase())
  );

  // Função auxiliar para definir a cor da "etiqueta" de status
  const corDoStatus = (status: string) => {
    if (status.includes('Autorizada')) return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
    if (status.includes('Offline')) return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' }; // Cancelada ou Erro
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <FileText size={28} color="#10b981" />
        <h2 style={{ margin: 0 }}>Documentos Fiscais (NFC-e)</h2>
      </header>

      <div style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', width: '400px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar por nº da nota, cliente ou status..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>

        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: cores.bgPainel, borderRadius: '8px', overflow: 'hidden', boxShadow: cores.sombra }}>
          <thead>
            <tr style={{ backgroundColor: cores.borda, textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Nº Nota</th>
              <th style={{ padding: '16px' }}>Data / Hora</th>
              <th style={{ padding: '16px' }}>Cliente</th>
              <th style={{ padding: '16px' }}>Valor</th>
              <th style={{ padding: '16px' }}>Status da SEFAZ</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {notasFiltradas.map(nota => {
              const cor = corDoStatus(nota.status);

              return (
                <tr key={nota.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{nota.num}</td>
                  <td style={{ padding: '16px', color: cores.textoSecundario }}>{nota.data}</td>
                  <td style={{ padding: '16px' }}>{nota.cliente}</td>
                  <td style={{ padding: '16px', fontWeight: '600' }}>R$ {nota.valor.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: cor.bg, color: cor.text
                    }}>
                      {nota.status}
                    </span>
                  </td>

                  <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    {/* Botões com o <span> em volta para evitar o erro do TypeScript com a prop "title" */}
                    <span onClick={() => alert(`Imprimindo cupom da nota ${nota.num}...`)} style={{ cursor: 'pointer', display: 'flex' }} title="Imprimir Cupom">
                      <FileOutput size={18} color="#3b82f6" />
                    </span>

                    <span onClick={() => alert(`Tentando transmitir nota ${nota.num} para a SEFAZ...`)} style={{ cursor: 'pointer', display: 'flex', opacity: nota.status.includes('Offline') ? 1 : 0.3 }} title="Transmitir para SEFAZ">
                      <RefreshCw size={18} color="#f59e0b" />
                    </span>

                    <span onClick={() => alert(`Iniciando cancelamento da nota ${nota.num}...`)} style={{ cursor: 'pointer', display: 'flex' }} title="Cancelar Nota">
                      <XCircle size={18} color="#ef4444" />
                    </span>
                  </td>
                </tr>
              )
            })}

            {notasFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: cores.textoSecundario }}>
                  Nenhuma nota encontrada para "{busca}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}