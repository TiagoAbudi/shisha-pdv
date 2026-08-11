import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Package, Search, Plus, Edit, Trash2, ArrowLeft, X } from 'lucide-react';

// Criamos um mock local baseado no seu antigo para podermos testar a adição e exclusão
const mockInicial = [
  { id: 1, codigoBarras: '789101010', nome: 'Coca-Cola 2L', categoria: 'Bebidas', preco: 10.00, estoque: 45 },
  { id: 2, codigoBarras: '789202020', nome: 'Cerveja Heineken LATA', categoria: 'Bebidas Alcoólicas', preco: 5.50, estoque: 120 },
];

export function Produtos({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  // Estados de pesquisa e lista
  const [busca, setBusca] = useState('');
  const [listaProdutos, setListaProdutos] = useState(mockInicial);

  // Estados do Modal de Cadastro
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ codigoBarras: '', nome: '', categoria: '', preco: '', estoque: '' });

  // Esc volta pro dashboard OU fecha o modal se estiver aberto
  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (modalAberto) setModalAberto(false);
    else aoVoltar();
  });

  // Filtro de pesquisa
  const produtosFiltrados = listaProdutos.filter(prod =>
    prod.nome.toLowerCase().includes(busca.toLowerCase()) ||
    prod.codigoBarras.includes(busca)
  );

  // Função para salvar novo produto na lista
  const salvarProduto = () => {
    if (!form.nome || !form.preco) return alert('Preencha pelo menos o nome e o preço!');

    const novoProduto = {
      id: Math.random(), // ID provisório até termos o banco de dados
      codigoBarras: form.codigoBarras || Math.floor(Math.random() * 1000000000).toString(),
      nome: form.nome,
      categoria: form.categoria || 'Sem Categoria',
      preco: parseFloat(form.preco.replace(',', '.')),
      estoque: parseInt(form.estoque) || 0
    };

    setListaProdutos([...listaProdutos, novoProduto]);
    setForm({ codigoBarras: '', nome: '', categoria: '', preco: '', estoque: '' }); // Limpa form
    setModalAberto(false); // Fecha modal
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <Package size={28} color="#f59e0b" />
        <h2 style={{ margin: 0 }}>Estoque e Produtos</h2>
      </header>

      <div style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', width: '400px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar por código ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>

          <button onClick={() => setModalAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Plus size={20} /> Novo Produto
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: cores.bgPainel, borderRadius: '8px', overflow: 'hidden', boxShadow: cores.sombra }}>
          <thead>
            <tr style={{ backgroundColor: cores.borda, textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Código</th>
              <th style={{ padding: '16px' }}>Descrição</th>
              <th style={{ padding: '16px' }}>Categoria</th>
              <th style={{ padding: '16px' }}>Preço (R$)</th>
              <th style={{ padding: '16px' }}>Estoque</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map(prod => (
              <tr key={prod.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                <td style={{ padding: '16px', fontFamily: 'monospace', color: cores.textoSecundario }}>{prod.codigoBarras}</td>
                <td style={{ padding: '16px', fontWeight: '500' }}>{prod.nome}</td>
                <td style={{ padding: '16px' }}>{prod.categoria}</td>
                <td style={{ padding: '16px', color: '#10b981', fontWeight: 'bold' }}>R$ {prod.preco.toFixed(2)}</td>
                <td style={{ padding: '16px', color: prod.estoque <= 10 ? '#ef4444' : cores.texto, fontWeight: prod.estoque <= 10 ? 'bold' : 'normal' }}>
                  {prod.estoque} un
                </td>
                <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <span style={{ cursor: 'pointer', display: 'flex' }} title="Editar"><Edit size={18} color="#3b82f6" /></span>
                  {/* Exclui o produto usando o ID */}
                  <span onClick={() => setListaProdutos(listaProdutos.filter(p => p.id !== prod.id))} style={{ cursor: 'pointer', display: 'flex' }} title="Excluir"><Trash2 size={18} color="#ef4444" /></span>
                </td>
              </tr>
            ))}

            {produtosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: cores.textoSecundario }}>
                  Nenhum produto encontrado para "{busca}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL SOBREPOSTO DE CADASTRO DE PRODUTO */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '450px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Cadastrar Produto</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={() => setModalAberto(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Nome / Descrição</label>
                <input autoFocus value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Código de Barras</label>
                  <input value={form.codigoBarras} onChange={(e) => setForm({ ...form, codigoBarras: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Categoria</label>
                  <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Preço Venda (R$)</label>
                  <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Estoque Atual</label>
                  <input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setModalAberto(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: cores.borda, color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarProduto} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Produto</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}