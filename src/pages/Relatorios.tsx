import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BarChart3, Package, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// --- MOCKS DE DADOS (Tabelas) ---
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

// --- MOCKS DE DADOS (Gráficos) ---
const dadosGraficoVendas = [
  { dia: 'Seg', total: 1200 }, { dia: 'Ter', total: 1500 }, { dia: 'Qua', total: 1100 },
  { dia: 'Qui', total: 1800 }, { dia: 'Sex', total: 3200 }, { dia: 'Sáb', total: 4500 }, { dia: 'Dom', total: 3800 },
];

const dadosGraficoProdutos = [
  { nome: 'Carvão Zomo', vendidos: 12 },
  { nome: 'Erva Kurupí', vendidos: 8 },
  { nome: 'Red Label', vendidos: 3 },
  { nome: 'Coca 2L', vendidos: 18 },
  { nome: 'Heineken', vendidos: 45 },
];

const dadosGraficoPagamentos = [
  { name: 'PIX', value: 310.00, color: '#10b981' },
  { name: 'Cartão', value: 480.50, color: '#3b82f6' },
  { name: 'Dinheiro', value: 195.00, color: '#f59e0b' },
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp color="#3b82f6" /> Faturamento dos Últimos 7 Dias</h3>
                <span style={{ backgroundColor: cores.bgGeral, padding: '8px 12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> Hoje: 11/08/2026</span>
              </div>

              {/* Gráfico de Vendas */}
              <div style={{ height: '260px', width: '100%', backgroundColor: cores.bgGeral, padding: '16px', borderRadius: '12px', border: `1px solid ${cores.borda}` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGraficoVendas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={cores.bordaForte} vertical={false} />
                    <XAxis dataKey="dia" stroke={cores.textoSecundario} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={cores.textoSecundario} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: cores.bgPainel, borderColor: cores.borda, color: cores.texto, borderRadius: '8px' }} itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="total" name="Faturamento" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela de Vendas */}
              <div>
                <h4 style={{ marginBottom: '16px', color: cores.textoSecundario }}>Últimos Cupons Emitidos</h4>
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
            </div>
          )}

          {/* RELATÓRIO 2: PRODUTOS */}
          {abaAtiva === 'produtos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Package color="#f59e0b" /> Top 5 Produtos Mais Vendidos</h3>

              {/* Gráfico de Produtos (Curva ABC) */}
              <div style={{ height: '260px', width: '100%', backgroundColor: cores.bgGeral, padding: '16px', borderRadius: '12px', border: `1px solid ${cores.borda}` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoProdutos} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={cores.bordaForte} horizontal={false} />
                    <XAxis type="number" stroke={cores.textoSecundario} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="nome" type="category" stroke={cores.textoSecundario} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: cores.borda }} contentStyle={{ backgroundColor: cores.bgPainel, borderColor: cores.borda, color: cores.texto, borderRadius: '8px' }} />
                    <Bar dataKey="vendidos" name="Unidades Vendidas" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela de Produtos */}
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
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#f59e0b' }}>{p.vendidos} un</td>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}` }}>
                  <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Clientes Atendidos Hoje</span>
                  <h2 style={{ fontSize: '28px', margin: '8px 0 0 0', color: '#8b5cf6' }}>42</h2>
                </div>
                <div style={{ padding: '20px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}` }}>
                  <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Ticket Médio</span>
                  <h2 style={{ fontSize: '28px', margin: '8px 0 0 0', color: cores.texto }}>R$ 48,50</h2>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600' }}>Inadimplência (Fiado Pendente)</span>
                  <h2 style={{ fontSize: '28px', margin: '8px 0 0 0', color: '#ef4444' }}>R$ 150,00</h2>
                </div>
              </div>

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign color="#10b981" /> Fechamento de Turno</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Lado Esquerdo: Valores e Resumo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, padding: '20px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}` }}>
                      <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Fundo (Abertura)</span>
                      <h2 style={{ fontSize: '24px', marginTop: '8px' }}>R$ 150,00</h2>
                    </div>
                    <div style={{ flex: 1, padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>Em Gaveta (Dinheiro)</span>
                      <h2 style={{ fontSize: '24px', marginTop: '8px', color: '#10b981' }}>R$ 345,00</h2>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#f59e0b' }} /> Dinheiro</span><strong>R$ 195,00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981' }} /> PIX</span><strong>R$ 310,00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6' }} /> Cartão</span><strong>R$ 480,50</strong>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Gráfico Pizza */}
                <div style={{ backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <span style={{ color: cores.textoSecundario, fontWeight: '600' }}>Distribuição de Pagamentos</span>
                  <div style={{ width: '100%', height: '250px', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dadosGraficoPagamentos} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                          {dadosGraficoPagamentos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                          contentStyle={{ backgroundColor: cores.bgPainel, borderColor: cores.borda, color: cores.texto, borderRadius: '8px' }}
                          itemStyle={{ fontWeight: 'bold', color: cores.texto }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '32px' }}>R$ 985,50</h2>
                  <span style={{ color: cores.textoSecundario, fontSize: '14px' }}>Faturamento Bruto</span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </TelaSecundaria>
  );
}