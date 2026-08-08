import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BarChart3, Package, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';

// --- MOCKS DE DADOS ---
const relatorioVendas = [
  { id: '1042', data: '08/08/2026 22:15', cliente: 'Consumidor Final', itens: 3, total: 115.50, pag: 'PIX' },
  { id: '1043', data: '08/08/2026 22:45', cliente: 'Tiago Abudi', itens: 1, total: 45.00, pag: 'Dinheiro' },
  { id: '1044', data: '08/08/2026 23:10', cliente: 'João Silva', itens: 5, total: 230.00, pag: 'Cartão de Crédito' },
];

const relatorioProdutos = [
  { id: '1', nome: 'Carvão Zomo 1kg', estoque: 45, vendidos: 12, valorEstoque: 2025.00 },
  { id: '2', nome: 'Whisky Red Label 1L', estoque: 8, vendidos: 3, valorEstoque: 959.20 },
  { id: '4', nome: 'Erva Mate Kurupí', estoque: 15, vendidos: 8, valorEstoque: 337.50 },
];

const relatorioClientes = [
  { nome: 'Maria Oliveira (Fiado)', compras: 12, totalGasto: 845.00, debito: 150.00 },
  { nome: 'Tiago Abudi', compras: 5, totalGasto: 320.00, debito: 0.00 },
  { nome: 'João Silva', compras: 8, totalGasto: 610.00, debito: 0.00 },
];

export function Relatorios({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();
  const [abaAtiva, setAbaAtiva] = useState<'vendas' | 'produtos' | 'clientes' | 'caixa'>('vendas');

  // Atalhos para trocar de aba rapidamente
  useHotkeys('1', () => setAbaAtiva('vendas'));
  useHotkeys('2', () => setAbaAtiva('produtos'));
  useHotkeys('3', () => setAbaAtiva('clientes'));
  useHotkeys('4', () => setAbaAtiva('caixa'));

  const BotoesAba = [
    { id: 'vendas', titulo: 'Histórico de Vendas', icone: <TrendingUp size={18} />, atalho: '[ 1 ]' },
    { id: 'produtos', titulo: 'Curva ABC (Estoque)', icone: <Package size={18} />, atalho: '[ 2 ]' },
    { id: 'clientes', titulo: 'Comportamento de Clientes', icone: <Users size={18} />, atalho: '[ 3 ]' },
    { id: 'caixa', titulo: 'Fechamento de Turno', icone: <DollarSign size={18} />, atalho: '[ 4 ]' },
  ] as const;

  return (
    <TelaSecundaria titulo="📊 Central de Relatórios" aoVoltar={aoVoltar}>
      <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
        
        {/* MENU LATERAL */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {BotoesAba.map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s',
                backgroundColor: abaAtiva === aba.id ? '#3b82f6' : cores.bgPainel,
                color: abaAtiva === aba.id ? '#ffffff' : cores.texto,
                border: abaAtiva === aba.id ? '1px solid #3b82f6' : `1px solid ${cores.borda}`,
                boxShadow: abaAtiva === aba.id ? '0 4px 14px 0 rgb(59 130 246 / 39%)' : cores.sombra,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                {aba.icone} {aba.titulo}
              </div>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>{aba.atalho}</span>
            </button>
          ))}
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <div style={{ flex: 1, backgroundColor: cores.bgPainel, borderRadius: '16px', border: `1px solid ${cores.borda}`, padding: '24px', boxShadow: cores.sombra, overflowY: 'auto' }}>
          
          {/* RELATÓRIO 1: VENDAS */}
          {abaAtiva === 'vendas' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp color="#3b82f6" /> Vendas Recentes</h3>
                <span style={{ backgroundColor: cores.bgGeral, padding: '8px 12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16}/> Hoje: 08/08/2026</span>
              </div>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                    <th style={{ padding: '12px', color: cores.textoSecundario }}>Hora / Recibo</th>
                    <th style={{ color: cores.textoSecundario }}>Cliente</th>
                    <th style={{ color: cores.textoSecundario }}>Pagamento</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioVendas.map(v => (
                    <tr key={v.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                      <td style={{ padding: '16px 12px' }}><strong style={{ display: 'block' }}>{v.data.split(' ')[1]}</strong><span style={{ color: cores.textoSecundario, fontSize: '12px' }}>#{v.id}</span></td>
                      <td>{v.cliente}</td>
                      <td><span style={{ padding: '4px 8px', backgroundColor: cores.bgGeral, borderRadius: '4px', fontSize: '13px', border: `1px solid ${cores.borda}` }}>{v.pag}</span></td>
                      <td style={{ textAlign: 'right', color: '#10b981', fontWeight: '700' }}>R$ {v.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* RELATÓRIO 2: PRODUTOS */}
          {abaAtiva === 'produtos' && (
            <div>
              <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}><Package color="#f59e0b" /> Curva ABC e Posição de Estoque</h3>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                    <th style={{ padding: '12px', color: cores.textoSecundario }}>Produto</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'center' }}>Vendidos (Hoje)</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'center' }}>Qtd. Estoque</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'right' }}>Capital em Estoque</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioProdutos.map(p => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                      <td style={{ padding: '16px 12px', fontWeight: '500' }}>{p.nome}</td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#3b82f6' }}>{p.vendidos} un</td>
                      <td style={{ textAlign: 'center' }}><span style={{ color: p.estoque < 10 ? '#ef4444' : cores.texto, fontWeight: '600' }}>{p.estoque} un</span></td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>R$ {p.valorEstoque.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* RELATÓRIO 3: CLIENTES */}
          {abaAtiva === 'clientes' && (
            <div>
              <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}><Users color="#8b5cf6" /> Comportamento de Clientes</h3>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                    <th style={{ padding: '12px', color: cores.textoSecundario }}>Nome do Cliente</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'center' }}>Qtd. Compras</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'right' }}>Total Gasto</th>
                    <th style={{ color: cores.textoSecundario, textAlign: 'right' }}>Débito (Fiado)</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioClientes.map((c, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                      <td style={{ padding: '16px 12px', fontWeight: '600' }}>{c.nome}</td>
                      <td style={{ textAlign: 'center' }}>{c.compras}</td>
                      <td style={{ textAlign: 'right' }}>R$ {c.totalGasto.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        {c.debito > 0 ? <span style={{ color: '#ef4444', fontWeight: '700', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>- R$ {c.debito.toFixed(2)}</span> : <span style={{ color: cores.textoSecundario }}>R$ 0.00</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* RELATÓRIO 4: FECHAMENTO DE CAIXA */}
          {abaAtiva === 'caixa' && (
            <div>
               <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}><DollarSign color="#10b981" /> Fechamento de Turno</h3>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div style={{ padding: '24px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}` }}>
                    <span style={{ color: cores.textoSecundario, fontSize: '14px', fontWeight: '600' }}>Fundo de Caixa (Abertura)</span>
                    <h2 style={{ fontSize: '28px', marginTop: '8px' }}>R$ 150,00</h2>
                  </div>
                  <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Total em Gaveta (Dinheiro)</span>
                    <h2 style={{ fontSize: '28px', marginTop: '8px', color: '#10b981' }}>R$ 345,00</h2>
                  </div>
               </div>

               <h4 style={{ color: cores.textoSecundario, marginBottom: '16px' }}>Resumo de Recebimentos</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                    <span>Dinheiro (Vendas)</span><strong>R$ 195,00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                    <span>PIX</span><strong>R$ 310,00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                    <span>Cartão de Crédito/Débito</span><strong>R$ 480,50</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: `1px solid rgba(239, 68, 68, 0.2)` }}>
                    <span style={{ color: '#ef4444' }}>Retiradas / Sangrias</span><strong style={{ color: '#ef4444' }}>- R$ 50,00</strong>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </TelaSecundaria>
  );
}