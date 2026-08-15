import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BarChart3, Package, Users, DollarSign, TrendingUp, Calendar, Lock, Unlock, Printer, ArrowDownToLine, ArrowUpFromLine, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TelaSecundaria } from '../components/TelaSecundaria';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useCaixaStore } from '../store/useCaixaStore';

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
  const [abaAtiva, setAbaAtiva] = useState<'vendas' | 'produtos' | 'clientes' | 'caixa'>('caixa');

  // --- ESTADOS DO GESTOR DE CAIXA ---
  const { statusCaixa, fundoRegistrado, abrirCaixa, fecharCaixa } = useCaixaStore();
  const [modalCaixa, setModalCaixa] = useState<'nenhum' | 'abertura' | 'fechamento' | 'sucesso'>('nenhum');
  const [fundoDeCaixa, setFundoDeCaixa] = useState('');
  const [dinheiroDeclarado, setDinheiroDeclarado] = useState('');

  // --- ESTADOS DE SANGRIA E SUPRIMENTO ---
  const [modalOperacao, setModalOperacao] = useState<'nenhum' | 'sangria' | 'suprimento'>('nenhum');
  const [valorOperacao, setValorOperacao] = useState('');
  const [motivoOperacao, setMotivoOperacao] = useState('');
  const [totalSangrias, setTotalSangrias] = useState(0);
  const [totalSuprimentos, setTotalSuprimentos] = useState(0);

  // --- ESTADO DO ALERTA CUSTOMIZADO ---
  const [alerta, setAlerta] = useState<{ visivel: boolean; titulo: string; mensagem: string } | null>(null);

  // Atalhos para trocar de aba rapidamente
  useHotkeys('1', () => setAbaAtiva('vendas'), { enableOnFormTags: false });
  useHotkeys('2', () => setAbaAtiva('produtos'), { enableOnFormTags: false });
  useHotkeys('3', () => setAbaAtiva('clientes'), { enableOnFormTags: false });
  useHotkeys('4', () => setAbaAtiva('caixa'), { enableOnFormTags: false });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (alerta?.visivel) {
      setAlerta(null);
      return;
    }
    if (modalOperacao !== 'nenhum') {
      setModalOperacao('nenhum');
      setValorOperacao('');
      setMotivoOperacao('');
    } else if (modalCaixa !== 'nenhum') {
      setModalCaixa('nenhum');
      setFundoDeCaixa('');
      setDinheiroDeclarado('');
    } else {
      aoVoltar();
    }
  }, { enableOnFormTags: true }, [modalCaixa, modalOperacao, alerta, aoVoltar]);

  const BotoesAba = [
    { id: 'vendas', titulo: 'Histórico de Vendas', icone: <TrendingUp size={18} />, atalho: '[ 1 ]' },
    { id: 'produtos', titulo: 'Curva ABC (Estoque)', icone: <Package size={18} />, atalho: '[ 2 ]' },
    { id: 'clientes', titulo: 'Comportamento de Clientes', icone: <Users size={18} />, atalho: '[ 3 ]' },
    { id: 'caixa', titulo: 'Controle de Caixa', icone: <DollarSign size={18} />, atalho: '[ 4 ]' },
  ] as const;

  const handleAbrirCaixa = () => {
    if (!fundoDeCaixa) {
      setAlerta({ visivel: true, titulo: 'Campo Obrigatório', mensagem: 'Por favor, informe o valor do troco inicial (fundo de caixa).' });
      return;
    }
    abrirCaixa(parseFloat(fundoDeCaixa.replace(',', '.')));
    setModalCaixa('nenhum');
    setTotalSangrias(0);
    setTotalSuprimentos(0);
  };

  const handleFecharCaixa = () => {
    setModalCaixa('sucesso');
    setTimeout(() => {
      fecharCaixa();
      setModalCaixa('nenhum');
      setFundoDeCaixa('');
      setDinheiroDeclarado('');
      setTotalSangrias(0);
      setTotalSuprimentos(0);
    }, 2500);
  };

  const handleConfirmarOperacao = () => {
    const val = parseFloat(valorOperacao.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setAlerta({ visivel: true, titulo: 'Valor Inválido', mensagem: 'Informe um valor numérico válido e maior que zero.' });
      return;
    }
    if (!motivoOperacao.trim()) {
      setAlerta({ visivel: true, titulo: 'Motivo Obrigatório', mensagem: 'Informe um motivo ou observação para registrar esta movimentação.' });
      return;
    }

    if (modalOperacao === 'sangria') {
      setTotalSangrias(prev => prev + val);
    } else if (modalOperacao === 'suprimento') {
      setTotalSuprimentos(prev => prev + val);
    }

    setModalOperacao('nenhum');
    setValorOperacao('');
    setMotivoOperacao('');
  };

  // Cálculos dinâmicos para a conferência
  const vendasEmDinheiro = 195.00;
  const dinheiroEsperado = fundoRegistrado + vendasEmDinheiro + totalSuprimentos - totalSangrias;
  const valorDeclaradoNum = parseFloat(dinheiroDeclarado.replace(',', '.')) || 0;
  const diferencaCaixa = dinheiroDeclarado ? valorDeclaradoNum - dinheiroEsperado : 0;

  return (
    <TelaSecundaria titulo="📊 Gestão Financeira e Relatórios" aoVoltar={aoVoltar}>
      <div style={{ display: 'flex', gap: '24px', height: '100%', position: 'relative' }}>

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

          {/* Card Resumo do Caixa Fixo na Lateral */}
          <div style={{ marginTop: 'auto', padding: '16px', backgroundColor: statusCaixa === 'aberto' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: `1px solid ${statusCaixa === 'aberto' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', color: statusCaixa === 'aberto' ? '#10b981' : '#ef4444' }}>
              {statusCaixa === 'aberto' ? <Unlock size={16} /> : <Lock size={16} />}
              Status do Caixa
            </span>
            <strong style={{ display: 'block', marginTop: '8px', fontSize: '16px', color: cores.texto }}>
              {statusCaixa === 'aberto' ? 'Turno em Andamento' : 'Caixa Encerrado'}
            </strong>
          </div>
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

          {/* --- GESTÃO DE CAIXA --- */}
          {abaAtiva === 'caixa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign color="#10b981" /> Controle de Caixa e Fechamento
                </h3>
                {statusCaixa === 'aberto' && (
                  <button onClick={() => setModalCaixa('fechamento')} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)' }}>
                    <Lock size={18} /> Fechar Caixa
                  </button>
                )}
              </div>

              {statusCaixa === 'fechado' ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${cores.bordaForte}`, borderRadius: '16px', backgroundColor: cores.bgGeral }}>
                  <Lock size={64} color={cores.textoSecundario} style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <h2 style={{ margin: '0 0 8px 0', color: cores.texto }}>O Caixa está Fechado</h2>
                  <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario }}>Nenhuma venda pode ser realizada ou registrada no momento.</p>
                  <button onClick={() => setModalCaixa('abertura')} style={{ padding: '16px 32px', fontSize: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)' }}>
                    <Unlock size={20} /> Abrir Caixa para Vendas
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', animation: 'fadeIn 0.3s' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ flex: 1, padding: '20px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}` }}>
                        <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Fundo (Troco Inicial)</span>
                        <h2 style={{ fontSize: '24px', marginTop: '8px' }}>R$ {fundoRegistrado.toFixed(2)}</h2>
                      </div>
                      <div style={{ flex: 1, padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>Em Gaveta (Dinheiro)</span>
                        <h2 style={{ fontSize: '24px', marginTop: '8px', color: '#10b981' }}>R$ {dinheiroEsperado.toFixed(2)}</h2>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#f59e0b' }} /> Vendas em Dinheiro</span><strong>+ R$ 195,00</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981' }} /> Vendas no PIX</span><strong>+ R$ 310,00</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6' }} /> Vendas no Cartão</span><strong>+ R$ 480,50</strong>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                      <button onClick={() => setModalOperacao('sangria')} style={{ padding: '12px', backgroundColor: cores.bgGeral, color: cores.texto, border: `1px solid ${cores.bordaForte}`, borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <ArrowUpFromLine size={18} color="#ef4444" /> Sangria (Retirada)
                      </button>
                      <button onClick={() => setModalOperacao('suprimento')} style={{ padding: '12px', backgroundColor: cores.bgGeral, color: cores.texto, border: `1px solid ${cores.bordaForte}`, borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <ArrowDownToLine size={18} color="#3b82f6" /> Suprimento (Entrada)
                      </button>
                    </div>

                  </div>

                  <div style={{ backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <span style={{ color: cores.textoSecundario, fontWeight: '600' }}>Faturamento Bruto (Turno)</span>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '36px' }}>R$ 985,50</h2>
                    <div style={{ width: '100%', height: '250px', marginTop: '16px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dadosGraficoPagamentos} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                            {dadosGraficoPagamentos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} contentStyle={{ backgroundColor: cores.bgPainel, borderColor: cores.borda, color: cores.texto, borderRadius: '8px' }} itemStyle={{ fontWeight: 'bold', color: cores.texto }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* --- MODAIS DE ABERTURA E FECHAMENTO --- */}

      {/* Modal de Abertura */}
      {modalCaixa === 'abertura' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '16px', padding: '32px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, textAlign: 'center' }}>
            <Unlock size={48} color="#10b981" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Abrir Caixa</h2>
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, fontSize: '14px' }}>Informe o valor do troco inicial (Fundo de Caixa) presente na gaveta para iniciar o turno.</p>

            <input
              autoFocus type="number" step="0.01" placeholder="0.00" value={fundoDeCaixa} onChange={(e) => setFundoDeCaixa(e.target.value)}
              style={{ width: '100%', padding: '16px', fontSize: '24px', textAlign: 'center', borderRadius: '12px', border: `2px solid #10b981`, backgroundColor: cores.bgInput, color: cores.texto, marginBottom: '24px', fontWeight: 'bold', outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setModalCaixa('nenhum'); setFundoDeCaixa(''); }} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={handleAbrirCaixa} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)' }}>Confirmar [ENTER]</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conferência e Fechamento */}
      {modalCaixa === 'fechamento' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '750px', borderRadius: '16px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '24px', backgroundColor: cores.bgGeral, borderBottom: `1px solid ${cores.borda}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={28} color="#ef4444" />
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#ef4444' }}>Conferência e Fechamento de Caixa</h2>
                <span style={{ fontSize: '13px', color: cores.textoSecundario }}>Verifique os totais das máquinas e declare o dinheiro em gaveta.</span>
              </div>
            </div>

            {/* Split View */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: cores.borda }}>

              {/* Esquerda: Relatório do Sistema */}
              <div style={{ padding: '24px', backgroundColor: cores.bgPainel }}>
                <h4 style={{ margin: '0 0 16px 0', color: cores.textoSecundario, textTransform: 'uppercase', fontSize: '12px' }}>Bate das Máquinas (Sistema)</h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Cartões Crédito/Débito</span>
                  <strong>R$ 480,50</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>PIX Eletrônico</span>
                  <strong>R$ 310,00</strong>
                </div>

                <div style={{ height: '1px', backgroundColor: cores.bordaForte, margin: '16px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Fundo Inicial (Troco)</span>
                  <strong>R$ {fundoRegistrado.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Vendas em Dinheiro</span>
                  <strong>R$ {vendasEmDinheiro.toFixed(2)}</strong>
                </div>

                {totalSuprimentos > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Suprimentos (Entrada)</span>
                    <strong style={{ color: '#3b82f6' }}>+ R$ {totalSuprimentos.toFixed(2)}</strong>
                  </div>
                )}
                {totalSangrias > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Sangrias (Retirada)</span>
                    <strong style={{ color: '#ef4444' }}>- R$ {totalSangrias.toFixed(2)}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Dinheiro Esperado</span>
                  <strong style={{ color: '#10b981', fontSize: '16px' }}>R$ {dinheiroEsperado.toFixed(2)}</strong>
                </div>
              </div>

              {/* Direita: Declaração do Operador */}
              <div style={{ padding: '24px', backgroundColor: cores.bgPainel }}>
                <h4 style={{ margin: '0 0 16px 0', color: cores.textoSecundario, textTransform: 'uppercase', fontSize: '12px' }}>Conferência da Gaveta</h4>

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Dinheiro Físico Contado (R$)</label>
                <input
                  autoFocus
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={dinheiroDeclarado}
                  onChange={(e) => setDinheiroDeclarado(e.target.value)}
                  style={{ width: '100%', padding: '16px', fontSize: '24px', textAlign: 'center', borderRadius: '12px', border: `2px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, marginBottom: '24px', fontWeight: 'bold', outline: 'none' }}
                />

                {dinheiroDeclarado && (
                  <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: diferencaCaixa === 0 ? 'rgba(16, 185, 129, 0.1)' : diferencaCaixa < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${diferencaCaixa === 0 ? 'rgba(16, 185, 129, 0.3)' : diferencaCaixa < 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: diferencaCaixa === 0 ? '#10b981' : diferencaCaixa < 0 ? '#ef4444' : '#f59e0b', marginBottom: '4px' }}>
                      {diferencaCaixa === 0 ? 'Caixa Batido Perfeitamente!' : diferencaCaixa < 0 ? 'Quebra de Caixa (Faltando)' : 'Sobra de Caixa (Passando)'}
                    </span>
                    <strong style={{ fontSize: '20px', color: diferencaCaixa === 0 ? '#10b981' : diferencaCaixa < 0 ? '#ef4444' : '#f59e0b' }}>
                      {diferencaCaixa === 0 ? 'R$ 0,00' : `${diferencaCaixa > 0 ? '+' : ''} R$ ${Math.abs(diferencaCaixa).toFixed(2)}`}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', backgroundColor: cores.bgGeral, display: 'flex', gap: '16px' }}>
              <button onClick={() => { setModalCaixa('nenhum'); setDinheiroDeclarado(''); }} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Revisar Valores</button>
              <button disabled={!dinheiroDeclarado} onClick={handleFecharCaixa} style={{ flex: 2, padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: !dinheiroDeclarado ? cores.bordaForte : '#ef4444', color: !dinheiroDeclarado ? cores.textoSecundario : '#fff', cursor: !dinheiroDeclarado ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: !dinheiroDeclarado ? 'none' : '0 4px 14px 0 rgba(239, 68, 68, 0.4)' }}>
                <Printer size={20} /> Confirmar Fechamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso de Fechamento */}
      {modalCaixa === 'sucesso' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '16px', padding: '48px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <Printer size={48} color="#10b981" />
            </div>
            <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '8px' }}>Caixa Encerrado!</h2>
            <p style={{ color: cores.textoSecundario, fontWeight: '500' }}>Imprimindo relatório Z de fechamento...</p>
          </div>
        </div>
      )}

      {/* --- MODAL UNIFICADO: SANGRIA E SUPRIMENTO --- */}
      {modalOperacao !== 'nenhum' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '450px', borderRadius: '16px', padding: '32px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, textAlign: 'center' }}>

            {modalOperacao === 'sangria' ? (
              <ArrowUpFromLine size={48} color="#ef4444" style={{ margin: '0 auto 16px auto' }} />
            ) : (
              <ArrowDownToLine size={48} color="#3b82f6" style={{ margin: '0 auto 16px auto' }} />
            )}

            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: modalOperacao === 'sangria' ? '#ef4444' : '#3b82f6' }}>
              {modalOperacao === 'sangria' ? 'Sangria (Retirada)' : 'Suprimento (Entrada)'}
            </h2>
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, fontSize: '14px' }}>
              {modalOperacao === 'sangria'
                ? 'Informe o valor que está sendo retirado do caixa e o motivo (Ex: Pagamento motoboy).'
                : 'Informe o valor que está sendo adicionado à gaveta e o motivo (Ex: Troco extra).'}
            </p>

            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Valor (R$)</label>
              <input
                autoFocus type="number" step="0.01" placeholder="0.00" value={valorOperacao} onChange={(e) => setValorOperacao(e.target.value)}
                style={{ width: '100%', padding: '16px', fontSize: '24px', textAlign: 'center', borderRadius: '12px', border: `2px solid ${modalOperacao === 'sangria' ? '#ef4444' : '#3b82f6'}`, backgroundColor: cores.bgInput, color: cores.texto, fontWeight: 'bold', outline: 'none' }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Motivo / Observação</label>
              <input
                type="text" placeholder={modalOperacao === 'sangria' ? "Ex: Pagamento fornecedor..." : "Ex: Adicionado para troco..."} value={motivoOperacao} onChange={(e) => setMotivoOperacao(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setModalOperacao('nenhum'); setValorOperacao(''); setMotivoOperacao(''); }} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={handleConfirmarOperacao} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: modalOperacao === 'sangria' ? '#ef4444' : '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold', boxShadow: `0 4px 14px 0 ${modalOperacao === 'sangria' ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'}` }}>
                Confirmar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL DE ALERTA CUSTOMIZADO (Substitui os alerts nativos) --- */}
      {alerta?.visivel && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertCircle size={28} color="#f59e0b" />
              <h3 style={{ margin: 0, color: cores.texto }}>{alerta.titulo}</h3>
            </div>
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, lineHeight: '1.5' }}>
              {alerta.mensagem}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAlerta(null)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Entendi [ ESC ]
              </button>
            </div>
          </div>
        </div>
      )}

    </TelaSecundaria>
  );
}