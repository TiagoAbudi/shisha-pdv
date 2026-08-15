import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Package, Search, Plus, Edit, Trash2, ArrowLeft, X, AlertCircle, FileUp, CheckCircle, Layers, ListPlus } from 'lucide-react';

type TipoProduto = {
  id: number;
  codigoBarras: string;
  nome: string;
  categoria: string;
  un: string;
  custo: number;
  preco: number;
  estoque: number | null; // O segredo da correção está aqui!
  tipo: string;
  ncm?: string;
  cest?: string;
  composicao: any[];
};

// Mock atualizado com exemplos para podermos montar um Combo legal
const mockInicial = [
  { id: 1, codigoBarras: '789101010', nome: 'Smirnoff Vodka 1L', categoria: 'Destilados', un: 'UN', custo: 35.00, preco: 55.00, estoque: 20, tipo: 'simples', composicao: [] },
  { id: 2, codigoBarras: '789202020', nome: 'Baly Energético 2L', categoria: 'Bebidas', un: 'UN', custo: 6.50, preco: 12.00, estoque: 50, tipo: 'simples', composicao: [] },
  { id: 3, codigoBarras: 'COMBO-SMIRNOFF', nome: 'Combo Smirnoff + 1 Baly 2L', categoria: 'Combos', un: 'CX', custo: 41.50, preco: 60.00, estoque: null, tipo: 'combo', composicao: [{ idProduto: 1, qtd: 1, nome: 'Smirnoff Vodka 1L', custoUnitario: 35.00 }, { idProduto: 2, qtd: 1, nome: 'Baly Energético 2L', custoUnitario: 6.50 }] }
];

export function Produtos({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  const [busca, setBusca] = useState('');
  const [listaProdutos, setListaProdutos] = useState<TipoProduto[]>(mockInicial as TipoProduto[]);

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEntradaXML, setModalEntradaXML] = useState(false);
  const [xmlCarregado, setXmlCarregado] = useState(false);

  // Estados de Formulário (Agora com suporte a tipo e composição)
  const [erroForm, setErroForm] = useState('');
  const [form, setForm] = useState({
    tipo: 'simples', // 'simples' ou 'combo'
    codigoBarras: '', nome: '', categoria: '', un: 'UN',
    custo: '', preco: '', estoque: '',
    ncm: '', cest: '',
    composicao: [] as { idProduto: number, qtd: number, nome: string, custoUnitario: number }[]
  });

  // Estados temporários para adicionar item na composição do combo
  const [compSelecionada, setCompSelecionada] = useState('');
  const [compQtd, setCompQtd] = useState('1');

  // Configurações da Entrada de XML
  const [entradaConfig, setEntradaConfig] = useState({
    atualizarEstoque: true,
    atualizarCusto: true,
    lancarFinanceiro: false
  });

  // Atalho Global: Esc fecha os modais primeiro
  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (modalEntradaXML) {
      setModalEntradaXML(false);
      setXmlCarregado(false);
    } else if (modalAberto) {
      fecharModal();
    } else {
      aoVoltar();
    }
  }, { enableOnFormTags: true });

  const produtosFiltrados = listaProdutos.filter(prod =>
    prod.nome.toLowerCase().includes(busca.toLowerCase()) ||
    prod.codigoBarras.includes(busca)
  );

  // Se for combo, o custo é a soma do custo dos ingredientes
  const custoCalculado = form.tipo === 'combo'
    ? form.composicao.reduce((acc, item) => acc + (item.custoUnitario * item.qtd), 0)
    : (parseFloat(form.custo) || 0);

  const precoNum = parseFloat(form.preco) || 0;
  const margemLucro = custoCalculado > 0 && precoNum > custoCalculado
    ? (((precoNum - custoCalculado) / custoCalculado) * 100).toFixed(2)
    : '0.00';

  const fecharModal = () => {
    setModalAberto(false);
    setErroForm('');
    setForm({ tipo: 'simples', codigoBarras: '', nome: '', categoria: '', un: 'UN', custo: '', preco: '', estoque: '', ncm: '', cest: '', composicao: [] });
    setCompSelecionada('');
  };

  const adicionarComponenteAoCombo = () => {
    if (!compSelecionada || !compQtd || Number(compQtd) <= 0) return;
    const produtoBase = listaProdutos.find(p => p.id === Number(compSelecionada));
    if (!produtoBase) return;

    const novoComponente = { idProduto: produtoBase.id, qtd: Number(compQtd), nome: produtoBase.nome, custoUnitario: produtoBase.custo };
    setForm({ ...form, composicao: [...form.composicao, novoComponente] });
    setCompSelecionada('');
    setCompQtd('1');
  };

  const removerComponente = (idProduto: number) => {
    setForm({ ...form, composicao: form.composicao.filter(c => c.idProduto !== idProduto) });
  };

  const salvarProduto = () => {
    setErroForm('');
    if (!form.nome.trim()) return setErroForm('A descrição do produto é obrigatória.');
    if (!form.preco || parseFloat(form.preco) <= 0) return setErroForm('O preço de venda deve ser maior que zero.');
    if (!form.ncm && form.tipo === 'simples') return setErroForm('O NCM é obrigatório para emissão de notas (NFC-e).');
    if (form.tipo === 'combo' && form.composicao.length < 2) return setErroForm('Um combo precisa ter pelo menos 2 itens na composição.');

    const novoProduto = {
      id: Math.random(),
      tipo: form.tipo,
      codigoBarras: form.codigoBarras || Math.floor(Math.random() * 1000000000).toString(),
      nome: form.nome,
      categoria: form.categoria || 'Sem Categoria',
      un: form.un,
      custo: custoCalculado,
      preco: parseFloat(form.preco.replace(',', '.')),
      estoque: form.tipo === 'combo' ? null : (parseInt(form.estoque) || 0),
      ncm: form.ncm,
      cest: form.cest,
      composicao: form.composicao
    };

    setListaProdutos([novoProduto, ...listaProdutos]);
    fecharModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <Package size={28} color="#f59e0b" />
        <h2 style={{ margin: 0 }}>Gestão de Produtos, Kits e Estoque</h2>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', width: '450px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Pesquisar por código de barras ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setModalEntradaXML(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: cores.bgPainel, color: cores.texto, border: `1px solid ${cores.bordaForte}`, padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <FileUp size={20} color="#3b82f6" /> Entrada XML (NF-e)
            </button>
            <button onClick={() => setModalAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <Plus size={20} /> Cadastrar Produto
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: cores.bgPainel, borderRadius: '8px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: cores.bgPainel, zIndex: 1 }}>
              <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Código</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Descrição do Produto</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Categoria</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'right' }}>Custo</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'right' }}>Venda</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Estoque</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map(prod => {
                const lucroCalc = prod.custo > 0 ? (((prod.preco - prod.custo) / prod.custo) * 100).toFixed(0) : 0;

                return (
                  <tr key={prod.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: cores.textoSecundario }}>
                      {prod.codigoBarras}
                      {prod.tipo === 'combo' && <span style={{ display: 'block', fontSize: '10px', color: '#8b5cf6', fontWeight: 'bold', marginTop: '4px' }}><Layers size={10} /> KIT/COMBO</span>}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{prod.nome}</td>
                    <td style={{ padding: '16px' }}>{prod.categoria}</td>
                    <td style={{ padding: '16px', textAlign: 'right', color: cores.textoSecundario }}>R$ {prod.custo.toFixed(2)}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <strong style={{ color: '#10b981', display: 'block' }}>R$ {prod.preco.toFixed(2)}</strong>
                      <span style={{ fontSize: '11px', color: cores.textoSecundario }}>Lucro: {lucroCalc}%</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {prod.tipo === 'combo' ? (
                        <span style={{ fontSize: '12px', color: cores.textoSecundario, fontWeight: '500' }}>Baixa nos Itens</span>
                      ) : (
                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', backgroundColor: prod.estoque! <= 10 ? 'rgba(239, 68, 68, 0.1)' : cores.bgGeral, color: prod.estoque! <= 10 ? '#ef4444' : cores.texto }}>
                          {prod.estoque} {prod.un}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                      <span style={{ cursor: 'pointer', display: 'flex' }} title="Editar"><Edit size={18} color="#3b82f6" /></span>
                      <span onClick={() => setListaProdutos(listaProdutos.filter(p => p.id !== prod.id))} style={{ cursor: 'pointer', display: 'flex' }} title="Excluir"><Trash2 size={18} color="#ef4444" /></span>
                    </td>
                  </tr>
                );
              })}

              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 24px', textAlign: 'center', color: cores.textoSecundario }}>
                    <Package size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
                    <br /> Nenhum produto encontrado para "{busca}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL 1: CADASTRO MANUAL DE PRODUTO/COMBO */}
      {/* ========================================= */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '700px', borderRadius: '12px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            <div style={{ padding: '20px 24px', backgroundColor: cores.bgGeral, borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Package color="#f59e0b" size={20} /> Cadastrar Produto / Kit</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={fecharModal} />
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              {erroForm && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: '500', fontSize: '14px' }}>
                  <AlertCircle size={20} /> {erroForm}
                </div>
              )}

              {/* SELEÇÃO DO TIPO DE PRODUTO */}
              <div style={{ display: 'flex', gap: '16px', backgroundColor: cores.bgGeral, padding: '16px', borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input type="radio" name="tipoProduto" checked={form.tipo === 'simples'} onChange={() => setForm({ ...form, tipo: 'simples' })} style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                  <Package size={18} color="#f59e0b" /> Produto Simples
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input type="radio" name="tipoProduto" checked={form.tipo === 'combo'} onChange={() => setForm({ ...form, tipo: 'combo', estoque: '' })} style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }} />
                  <Layers size={18} color="#8b5cf6" /> Combo / Kit (Composto)
                </label>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Nome / Descrição *</label>
                    <input autoFocus value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Categoria</label>
                    <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Código de Barras (EAN/GTIN)</label>
                    <input value={form.codigoBarras} onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Unidade</label>
                    <select value={form.un} onChange={(e) => setForm({ ...form, un: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}>
                      <option value="UN">UN - Unidade</option>
                      <option value="KG">KG - Quilograma</option>
                      <option value="CX">CX - Caixa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* MÓDULO EXCLUSIVO DE MONTAGEM DO COMBO */}
              {form.tipo === 'combo' && (
                <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', padding: '16px', borderRadius: '12px', border: `1px dashed rgba(139, 92, 246, 0.4)` }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#8b5cf6', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><ListPlus size={18} /> Composição do Combo</h4>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <select value={compSelecionada} onChange={(e) => setCompSelecionada(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}>
                      <option value="">Selecione um produto base...</option>
                      {listaProdutos.filter(p => p.tipo === 'simples').map(p => (
                        <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.estoque})</option>
                      ))}
                    </select>
                    <input type="number" min="1" value={compQtd} onChange={(e) => setCompQtd(e.target.value)} style={{ width: '80px', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} title="Quantidade deste item no combo" />
                    <button onClick={adicionarComponenteAoCombo} style={{ padding: '10px 16px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Adicionar</button>
                  </div>

                  {form.composicao.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {form.composicao.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                          <span style={{ fontSize: '14px' }}><strong>{item.qtd}x</strong> {item.nome}</span>
                          <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removerComponente(item.idProduto)} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '13px', color: cores.textoSecundario }}>Adicione pelo menos 2 produtos para formar este combo.</span>
                  )}
                </div>
              )}

              <div style={{ height: '1px', backgroundColor: cores.borda }} />

              {/* VALORES E ESTOQUE */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: cores.textoSecundario, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Valores e Estoque</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Custo (R$)</label>
                    <input disabled={form.tipo === 'combo'} type="number" step="0.01" value={form.tipo === 'combo' ? custoCalculado.toFixed(2) : form.custo} onChange={(e) => setForm({ ...form, custo: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: form.tipo === 'combo' ? cores.bgGeral : cores.bgInput, color: form.tipo === 'combo' ? cores.textoSecundario : cores.texto }} title={form.tipo === 'combo' ? "O custo do combo é a soma dos seus componentes" : ""} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Margem</label>
                    <div style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgGeral, color: '#10b981', fontWeight: 'bold' }}>{margemLucro}%</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Venda (R$) *</label>
                    <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `2px solid #3b82f6`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Estoque Atual</label>
                    {form.tipo === 'combo' ? (
                      <div style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgGeral, color: cores.textoSecundario, fontSize: '13px', fontWeight: '500' }}>Automático na venda</div>
                    ) : (
                      <input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                    )}
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: cores.borda }} />

              <div>
                <h4 style={{ margin: '0 0 12px 0', color: cores.textoSecundario, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dados Fiscais (NFC-e)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>NCM *</label>
                    <input value={form.ncm} onChange={(e) => setForm({ ...form, ncm: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>CEST</label>
                    <input value={form.cest} onChange={(e) => setForm({ ...form, cest: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                </div>
              </div>

            </div>

            <div style={{ padding: '16px 24px', backgroundColor: cores.bgGeral, borderTop: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={fecharModal} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarProduto} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: form.tipo === 'combo' ? '#8b5cf6' : '#f59e0b', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Salvar {form.tipo === 'combo' ? 'Combo' : 'Produto'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: ENTRADA DE NOTA DE COMPRA (XML)  */}
      {/* ========================================= */}
      {modalEntradaXML && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '550px', borderRadius: '12px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            <div style={{ padding: '20px 24px', backgroundColor: cores.bgGeral, borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}><FileUp size={20} /> Entrada de XML (NF-e de Compra)</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={() => { setModalEntradaXML(false); setXmlCarregado(false); }} />
            </div>

            <div style={{ padding: '24px' }}>

              {!xmlCarregado ? (
                // TELA 1 DO MODAL: Selecionar o Arquivo
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', border: `2px dashed ${cores.bordaForte}`, borderRadius: '12px', backgroundColor: cores.bgGeral, cursor: 'pointer' }} onClick={() => setXmlCarregado(true)}>
                  <FileUp size={48} color="#3b82f6" style={{ marginBottom: '16px', opacity: 0.8 }} />
                  <strong style={{ fontSize: '16px', marginBottom: '8px' }}>Clique para selecionar o XML</strong>
                  <span style={{ fontSize: '13px', color: cores.textoSecundario }}>Importe a nota do seu fornecedor para dar entrada no estoque.</span>
                </div>
              ) : (
                // TELA 2 DO MODAL: Resumo da Leitura e Ações
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '24px' }}>
                    <CheckCircle size={24} color="#10b981" />
                    <div>
                      <strong style={{ display: 'block', color: '#10b981', marginBottom: '4px' }}>XML Lido com Sucesso!</strong>
                      <span style={{ fontSize: '13px', color: cores.textoSecundario }}>Fornecedor: AMBEV S.A | Chave: 4126...1234</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                      <span style={{ fontSize: '12px', color: cores.textoSecundario, display: 'block' }}>Qtd. de Produtos Encontrados</span>
                      <strong style={{ fontSize: '20px' }}>42 Itens</strong>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                      <span style={{ fontSize: '12px', color: cores.textoSecundario, display: 'block' }}>Valor Total da Nota</span>
                      <strong style={{ fontSize: '20px', color: '#ef4444' }}>R$ 1.845,50</strong>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: cores.textoSecundario }}>Ações Automáticas:</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={entradaConfig.atualizarEstoque} onChange={() => setEntradaConfig({ ...entradaConfig, atualizarEstoque: !entradaConfig.atualizarEstoque })} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                      <span style={{ fontSize: '14px' }}>Somar quantidades no estoque atual</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={entradaConfig.atualizarCusto} onChange={() => setEntradaConfig({ ...entradaConfig, atualizarCusto: !entradaConfig.atualizarCusto })} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                      <span style={{ fontSize: '14px' }}>Atualizar "Preço de Custo" dos produtos cadastrados</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={entradaConfig.lancarFinanceiro} onChange={() => setEntradaConfig({ ...entradaConfig, lancarFinanceiro: !entradaConfig.lancarFinanceiro })} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
                      <span style={{ fontSize: '14px' }}>Lançar dívida (R$ 1.845,50) no Contas a Pagar</span>
                    </label>
                  </div>
                </div>
              )}

            </div>

            <div style={{ padding: '16px 24px', backgroundColor: cores.bgGeral, borderTop: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => { setModalEntradaXML(false); setXmlCarregado(false); }} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              {xmlCarregado && (
                <button onClick={() => { setModalEntradaXML(false); setXmlCarregado(false); }} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Processar Entrada</button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}