import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Wallet, Search, Plus, CheckCircle, Trash2, ArrowLeft, X, Filter, AlertCircle, Repeat, Tag, CalendarDays } from 'lucide-react';

const mockInicial = [
  { id: 1, descricao: 'Fornecedor - Ambev', categoria: 'Fornecedores', vencimento: '18/08/2026', valor: 1250.00, status: 'Pendente', recorrente: false, parcela: '' },
  { id: 2, descricao: 'Conta de Luz (Copel)', categoria: 'Despesas Fixas', vencimento: '12/08/2026', valor: 450.00, status: 'Atrasado', recorrente: true, parcela: 'Mensal' },
  { id: 3, descricao: 'Aluguel da Sala', categoria: 'Despesas Fixas', vencimento: '10/08/2026', valor: 2500.00, status: 'Pago', recorrente: true, parcela: 'Mensal' },
  { id: 4, descricao: 'Compra de Computador', categoria: 'Equipamentos', vencimento: '20/08/2026', valor: 800.00, status: 'Pendente', recorrente: true, parcela: '1/3' },
];

export function ContasPagar({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  // Estados da Tela
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [listaContas, setListaContas] = useState(mockInicial);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [erroForm, setErroForm] = useState('');
  const [form, setForm] = useState({
    descricao: '', categoria: 'Fornecedores', vencimento: '', valor: '',
    recorrente: false, tipoRecorrencia: 'fixa', parcelas: '2'
  });

  // Atalhos
  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (modalAberto) fecharModal();
    else aoVoltar();
  }, { enableOnFormTags: true });

  const fecharModal = () => {
    setModalAberto(false);
    setErroForm('');
    setForm({ descricao: '', categoria: 'Fornecedores', vencimento: '', valor: '', recorrente: false, tipoRecorrencia: 'fixa', parcelas: '2' });
  };

  // Filtro de pesquisa múltiplo
  const contasFiltradas = listaContas.filter(conta => {
    const atendeBusca = conta.descricao.toLowerCase().includes(busca.toLowerCase()) || conta.categoria.toLowerCase().includes(busca.toLowerCase());
    const atendeStatus = filtroStatus === 'Todos' || conta.status === filtroStatus;
    return atendeBusca && atendeStatus;
  });

  // Lógica para definir as cores do Status
  const corDoStatus = (status: string) => {
    if (status === 'Pago') return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
    if (status === 'Atrasado') return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
    return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' }; // Pendente
  };

  // Função avançada para gerar as parcelas projetando os meses
  const gerarParcelas = (dataBase: string, numParcelas: number) => {
    const datas = [];
    let [dia, mes, ano] = dataBase.split('/').map(Number);
    for (let i = 0; i < numParcelas; i++) {
      let nMes = mes + i;
      let nAno = ano;
      if (nMes > 12) { nMes -= 12; nAno++; }
      const diaFormatado = String(dia).padStart(2, '0');
      const mesFormatado = String(nMes).padStart(2, '0');
      datas.push(`${diaFormatado}/${mesFormatado}/${nAno}`);
    }
    return datas;
  };

  const salvarConta = () => {
    setErroForm('');
    if (!form.descricao.trim() || !form.valor || !form.vencimento) {
      return setErroForm('Preencha a descrição, o vencimento e o valor.');
    }

    const valorNum = parseFloat(form.valor.replace(',', '.'));
    let novasContas = [];

    if (form.recorrente && form.tipoRecorrencia === 'parcelada') {
      const qtdParcelas = parseInt(form.parcelas) || 1;
      const datasVencimento = gerarParcelas(form.vencimento, qtdParcelas);

      for (let i = 0; i < qtdParcelas; i++) {
        novasContas.push({
          id: Math.random(),
          descricao: form.descricao,
          categoria: form.categoria,
          vencimento: datasVencimento[i],
          valor: valorNum,
          status: 'Pendente',
          recorrente: true,
          parcela: `${i + 1}/${qtdParcelas}`
        });
      }
    } else {
      novasContas.push({
        id: Math.random(),
        descricao: form.descricao,
        categoria: form.categoria,
        vencimento: form.vencimento,
        valor: valorNum,
        status: 'Pendente',
        recorrente: form.recorrente,
        parcela: form.recorrente ? 'Mensal' : ''
      });
    }

    setListaContas([...novasContas, ...listaContas]);
    fecharModal();
  };

  const marcarComoPago = (id: number) => {
    setListaContas(listaContas.map(conta => conta.id === id ? { ...conta, status: 'Pago' } : conta));
  };

  const excluirConta = (id: number) => {
    setListaContas(listaContas.filter(conta => conta.id !== id));
  };

  // Cálculos de Resumo KPI
  const totalPendente = listaContas.filter(c => c.status === 'Pendente').reduce((acc, c) => acc + c.valor, 0);
  const totalAtrasado = listaContas.filter(c => c.status === 'Atrasado').reduce((acc, c) => acc + c.valor, 0);
  const totalPago = listaContas.filter(c => c.status === 'Pago').reduce((acc, c) => acc + c.valor, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <Wallet size={28} color="#ef4444" />
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Contas a Pagar (Despesas)</h2>
          <span style={{ color: cores.textoSecundario, fontSize: '13px' }}>Gestão de fornecedores, contas fixas e projeção de caixa</span>
        </div>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Dashboards Financeiros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${totalAtrasado > 0 ? '#ef4444' : cores.borda}`, boxShadow: cores.sombra }}>
            <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Total Atrasado</span>
            <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', color: totalAtrasado > 0 ? '#ef4444' : cores.texto }}>R$ {totalAtrasado.toFixed(2)}</h2>
          </div>
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>A Vencer (Pendentes)</span>
            <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', color: '#f59e0b' }}>R$ {totalPendente.toFixed(2)}</h2>
          </div>
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Total Pago (Este mês)</span>
            <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', color: '#10b981' }}>R$ {totalPago.toFixed(2)}</h2>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar por descrição, fornecedor ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '0 16px', border: `1px solid ${cores.borda}` }}>
            <Filter size={18} color={cores.textoSecundario} style={{ marginRight: '8px' }} />
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, height: '100%', outline: 'none', fontWeight: '500' }}>
              <option value="Todos" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Todos os Status</option>
              <option value="Pendente" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Pendentes / A Vencer</option>
              <option value="Atrasado" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Atrasadas</option>
              <option value="Pago" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Pagas</option>
            </select>
          </div>

          <button onClick={() => setModalAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Plus size={20} /> Nova Despesa
          </button>
        </div>

        {/* Tabela de Contas */}
        <div style={{ backgroundColor: cores.bgPainel, borderRadius: '8px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Descrição / Fornecedor</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Categoria</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Vencimento</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'right' }}>Valor (R$)</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contasFiltradas.map(conta => {
                const cor = corDoStatus(conta.status);
                return (
                  <tr key={conta.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontWeight: '600' }}>{conta.descricao}</strong>
                        {conta.recorrente && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', backgroundColor: cores.bgGeral, border: `1px solid ${cores.bordaForte}`, padding: '2px 6px', borderRadius: '12px', color: '#3b82f6' }} title="Conta Recorrente / Parcelada">
                            <Repeat size={12} /> {conta.parcela}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: cores.textoSecundario }}>{conta.categoria}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{conta.vencimento}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', textAlign: 'right', color: conta.status === 'Pago' ? cores.textoSecundario : cores.texto }}>
                      R$ {conta.valor.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', backgroundColor: cor.bg, color: cor.text, border: `1px solid ${cor.border}` }}>
                        {conta.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      {conta.status !== 'Pago' ? (
                        <span onClick={() => marcarComoPago(conta.id)} style={{ cursor: 'pointer', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}` }} title="Dar Baixa (Pagar)">
                          <CheckCircle size={18} color="#10b981" />
                        </span>
                      ) : (
                        <span style={{ display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}`, opacity: 0.3, cursor: 'not-allowed' }} title="Conta já paga">
                          <CheckCircle size={18} color="#10b981" />
                        </span>
                      )}
                      <span onClick={() => excluirConta(conta.id)} style={{ cursor: 'pointer', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}` }} title="Excluir Conta">
                        <Trash2 size={18} color="#ef4444" />
                      </span>
                    </td>
                  </tr>
                );
              })}

              {contasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: cores.textoSecundario }}>
                    <Wallet size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
                    <br /> Nenhuma despesa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SOBREPOSTO DE CADASTRO FINANCEIRO */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '550px', borderRadius: '12px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            <div style={{ padding: '20px 24px', backgroundColor: cores.bgGeral, borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}><Wallet size={20} /> Lançar Nova Despesa</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={fecharModal} />
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {erroForm && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: '500', fontSize: '14px' }}>
                  <AlertCircle size={20} /> {erroForm}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>Descrição / Fornecedor *</label>
                  <input autoFocus placeholder="Ex: Conta de Energia" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>Plano de Contas</label>
                  <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}>
                    <option value="Fornecedores">Fornecedores / Compras</option>
                    <option value="Despesas Fixas">Despesas Fixas (Água, Luz)</option>
                    <option value="Impostos">Impostos / Taxas</option>
                    <option value="Folha de Pagamento">Folha de Pagamento</option>
                    <option value="Equipamentos">Equipamentos / Manutenção</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}><CalendarDays size={14} /> Vencimento Inicial *</label>
                  <input type="text" placeholder="DD/MM/AAAA" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>Valor da Parcela (R$) *</label>
                  <input type="number" step="0.01" placeholder="0.00" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `2px solid #ef4444`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }} />
                </div>
              </div>

              {/* BLOCO DE RECORRÊNCIA */}
              <div style={{ backgroundColor: cores.bgGeral, padding: '16px', borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: form.recorrente ? '16px' : '0' }}>
                  <input type="checkbox" checked={form.recorrente} onChange={(e) => setForm({ ...form, recorrente: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                  <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Repeat size={16} color="#3b82f6" /> Despesa Recorrente ou Parcelada?</strong>
                </label>

                {form.recorrente && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', animation: 'fadeIn 0.3s' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: cores.textoSecundario }}>Tipo</label>
                      <select value={form.tipoRecorrencia} onChange={(e) => setForm({ ...form, tipoRecorrencia: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}>
                        <option value="fixa">Conta Fixa Contínua (Mensal)</option>
                        <option value="parcelada">Compra Parcelada (Fim programado)</option>
                      </select>
                    </div>
                    {form.tipoRecorrencia === 'parcelada' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: cores.textoSecundario }}>Nº de Parcelas</label>
                        <input type="number" min="2" max="60" value={form.parcelas} onChange={(e) => setForm({ ...form, parcelas: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            <div style={{ padding: '16px 24px', backgroundColor: cores.bgGeral, borderTop: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={fecharModal} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarConta} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Lançamento</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}