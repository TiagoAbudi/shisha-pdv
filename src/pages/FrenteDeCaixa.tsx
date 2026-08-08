import { useState, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ArrowLeft, Search, CreditCard, XCircle, UserPlus, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Produto } from '../types';
import { produtosMock } from '../mocks/produtos';

const clientesMock = [
  { id: '1', nome: 'Tiago Abudi', cpf: '111.222.333-44' },
  { id: '2', nome: 'João Silva', cpf: '555.666.777-88' },
  { id: '3', nome: 'Maria Oliveira (Fiado)', cpf: '999.888.777-66' },
];

export function FrenteDeCaixa({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme(); // Consumindo do Contexto
  
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [modalAtual, setModalAtual] = useState<'fechado' | 'selecao' | 'dinheiro' | 'sucesso' | 'cliente'>('fechado');
  const [valorRecebido, setValorRecebido] = useState('');
  
  const inputBuscaRef = useRef<HTMLInputElement>(null);
  const inputClienteRef = useRef<HTMLInputElement>(null);

  useHotkeys('esc', (e) => { e.preventDefault(); if (modalAtual !== 'fechado') { setModalAtual('fechado'); setValorRecebido(''); setBuscaCliente(''); inputBuscaRef.current?.focus(); } else aoVoltar(); }, { enableOnFormTags: true }, [modalAtual]);
  useHotkeys('f2', (e) => { e.preventDefault(); if (modalAtual === 'fechado') inputBuscaRef.current?.focus(); }, [modalAtual]);
  useHotkeys('f5', (e) => { e.preventDefault(); if (carrinho.length > 0) setModalAtual('selecao'); else alert('Adicione produtos antes de pagar!'); }, { enableOnFormTags: true }, [carrinho, modalAtual]);
  useHotkeys('f6', (e) => { e.preventDefault(); if (modalAtual === 'fechado' && carrinho.length > 0) { setCarrinho([]); setClienteSelecionado(null); } }, { enableOnFormTags: true }, [modalAtual, carrinho]);
  useHotkeys('f8', (e) => { e.preventDefault(); if (modalAtual === 'fechado') { setModalAtual('cliente'); setTimeout(() => inputClienteRef.current?.focus(), 100); } }, { enableOnFormTags: true }, [modalAtual]);
  useHotkeys('1', () => { if (modalAtual === 'selecao') setModalAtual('dinheiro'); }, [modalAtual]);
  useHotkeys('2', () => { if (modalAtual === 'selecao') finalizarVenda('Cartão / PIX'); }, [modalAtual]);

  const adicionarProduto = (produto: Produto) => setCarrinho([...carrinho, produto]);
  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  const finalizarVenda = (forma: string, troco: number = 0) => {
    setModalAtual('sucesso');
    setTimeout(() => {
      setCarrinho([]); setClienteSelecionado(null); setModalAtual('fechado'); setValorRecebido(''); inputBuscaRef.current?.focus();
    }, 1500);
  };

  const handleKeyDownBusca = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!busca.trim()) return;
      let quantidade = 1; let termoBusca = busca;
      if (busca.includes('*')) { const partes = busca.split('*'); quantidade = parseInt(partes[0]) || 1; termoBusca = partes[1]; }
      const produtoEncontrado = produtosMock.find((p) => p.codigoBarras === termoBusca || p.nome.toLowerCase() === termoBusca.toLowerCase());
      if (produtoEncontrado) {
        setCarrinho([...carrinho, ...Array(quantidade).fill(produtoEncontrado)]);
        setBusca(''); 
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>
      
      {modalAtual !== 'fechado' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {modalAtual === 'cliente' && (
            <div style={{ backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, width: '500px', boxShadow: cores.sombra }}>
              <h2 style={{ color: '#8b5cf6', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}><UserPlus size={24} /> Identificar Cliente</h2>
              <input ref={inputClienteRef} placeholder="Buscar por nome ou CPF..." value={buscaCliente} onChange={(e) => setBuscaCliente(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, marginBottom: '16px', outline: 'none' }} />
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {clientesMock.filter(c => c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || c.cpf.includes(buscaCliente)).map(c => (
                  <div key={c.id} onClick={() => { setClienteSelecionado(c); setModalAtual('fechado'); setBuscaCliente(''); inputBuscaRef.current?.focus(); }} style={{ padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', border: `1px solid ${cores.borda}`, alignItems: 'center' }}>
                    <strong style={{ color: cores.texto }}>{c.nome}</strong><span style={{ color: cores.textoSecundario, fontSize: '14px' }}>{c.cpf}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => { setClienteSelecionado(null); setModalAtual('fechado'); inputBuscaRef.current?.focus(); }} style={{ marginTop: '24px', width: '100%', padding: '16px', backgroundColor: cores.bgInput, color: cores.texto, border: `1px solid ${cores.bordaForte}`, borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar [ ESC ]</button>
            </div>
          )}

          {modalAtual === 'selecao' && (
            <div style={{ backgroundColor: cores.bgPainel, padding: '40px', borderRadius: '16px', border: `1px solid ${cores.borda}`, width: '450px', textAlign: 'center', boxShadow: cores.sombra }}>
              <span style={{ color: cores.textoSecundario, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total a Pagar</span>
              <h2 style={{ color: '#10b981', marginBottom: '32px', fontSize: '48px', fontWeight: '800' }}>R$ {total.toFixed(2)}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => setModalAtual('dinheiro')} style={{ padding: '20px', fontSize: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgb(59 130 246 / 39%)' }}>[ 1 ] Dinheiro</button>
                <button onClick={() => finalizarVenda('Cartão / PIX')} style={{ padding: '20px', fontSize: '18px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgb(139 92 246 / 39%)' }}>[ 2 ] Cartão / PIX</button>
              </div>
              <p style={{ color: cores.textoSecundario, fontSize: '14px', fontWeight: '500' }}>[ ESC ] Voltar</p>
            </div>
          )}

          {modalAtual === 'dinheiro' && (
            <div style={{ backgroundColor: cores.bgPainel, padding: '40px', borderRadius: '16px', border: `1px solid ${cores.borda}`, width: '450px', textAlign: 'center', boxShadow: cores.sombra }}>
              <h2 style={{ color: '#3b82f6', marginBottom: '8px', fontSize: '24px' }}>Dinheiro</h2>
              <h3 style={{ color: cores.textoSecundario, marginBottom: '24px', fontWeight: '500' }}>Total: <strong style={{ color: cores.texto }}>R$ {total.toFixed(2)}</strong></h3>
              <input type="number" autoFocus placeholder="Valor recebido (R$)" value={valorRecebido} onChange={(e) => setValorRecebido(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { const recebido = parseFloat(valorRecebido); if (recebido >= total) finalizarVenda('Dinheiro', recebido - total); else alert('Valor insuficiente!'); } }} style={{ width: '100%', padding: '20px', fontSize: '24px', borderRadius: '12px', border: `2px solid #3b82f6`, backgroundColor: cores.bgInput, color: cores.texto, marginBottom: '24px', textAlign: 'center', fontWeight: 'bold', outline: 'none' }} />
              {parseFloat(valorRecebido) > total && <div style={{ padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}><h2 style={{ color: '#f59e0b', margin: 0 }}>Troco: R$ {(parseFloat(valorRecebido) - total).toFixed(2)}</h2></div>}
              <p style={{ color: cores.textoSecundario, fontSize: '14px', marginTop: '16px', fontWeight: '500' }}>Confirme no [ ENTER ]</p>
            </div>
          )}

          {modalAtual === 'sucesso' && (
            <div style={{ backgroundColor: cores.bgPainel, padding: '48px', borderRadius: '16px', border: `1px solid ${cores.borda}`, width: '400px', textAlign: 'center', boxShadow: cores.sombra }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                <FileText size={48} color="#10b981" />
              </div>
              <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '8px' }}>Venda Concluída!</h2>
              <p style={{ color: cores.textoSecundario, fontWeight: '500' }}>Emitindo NFC-e...</p>
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 2, padding: '24px', borderRight: `1px solid ${cores.borda}`, display: 'flex', flexDirection: 'column', opacity: modalAtual !== 'fechado' ? 0.4 : 1, transition: 'opacity 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: cores.texto }}>PDV Livre</h2>
            <span style={{ color: cores.textoSecundario, fontSize: '14px' }}>Bipe os produtos para adicionar ao cupom</span>
          </div>
          <button onClick={aoVoltar} style={{ padding: '10px 16px', backgroundColor: cores.bgPainel, color: cores.texto, border: `1px solid ${cores.borda}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', boxShadow: cores.sombra }}>
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color={cores.textoSecundario} style={{ position: 'absolute', left: '16px', top: '16px' }} />
            <input ref={inputBuscaRef} type="text" placeholder="[F2] Digite QTD*CÓDIGO ou bipar o produto..." value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={handleKeyDownBusca} style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '16px', borderRadius: '12px', border: `2px solid #3b82f6`, backgroundColor: cores.bgPainel, color: cores.texto, outline: 'none', boxShadow: '0 4px 14px 0 rgb(59 130 246 / 15%)' }} autoFocus />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
          {produtosMock.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigoBarras.includes(busca)).map(p => (
            <div key={p.id} onClick={() => adicionarProduto(p)} style={{ border: `1px solid ${cores.borda}`, padding: '20px', cursor: 'pointer', borderRadius: '16px', backgroundColor: cores.bgPainel, boxShadow: cores.sombra, display: 'flex', flexDirection: 'column', gap: '8px', transition: 'transform 0.1s' }}>
              <strong style={{ fontSize: '16px', lineHeight: '1.2' }}>{p.nome}</strong>
              <span style={{ color: cores.textoSecundario, fontSize: '12px', fontFamily: 'monospace' }}>{p.codigoBarras}</span>
              <span style={{ color: '#10b981', fontSize: '20px', fontWeight: '800', marginTop: 'auto' }}>R$ {p.preco.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', backgroundColor: cores.bgPainel, opacity: modalAtual !== 'fechado' ? 0.4 : 1, transition: 'opacity 0.3s' }}>
        
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: cores.textoSecundario, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cliente</span>
            <strong style={{ display: 'block', color: clienteSelecionado ? '#8b5cf6' : cores.texto, fontSize: '16px', marginTop: '4px' }}>{clienteSelecionado ? `${clienteSelecionado.nome}` : 'Consumidor Final'}</strong>
          </div>
          <button onClick={() => setModalAtual('cliente')} style={{ backgroundColor: cores.bgPainel, border: `1px solid ${cores.bordaForte}`, color: cores.texto, padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', boxShadow: cores.sombra }}>[F8] Alterar</button>
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: cores.textoSecundario }}>Resumo da Compra</h3>
        
        <div style={{ flex: 1, backgroundColor: cores.bgGeral, color: cores.texto, padding: '16px', borderRadius: '12px', border: `1px solid ${cores.borda}`, overflowY: 'auto' }}>
          {carrinho.length === 0 && <div style={{ color: cores.textoSecundario, textAlign: 'center', marginTop: '40px', fontWeight: '500' }}>O carrinho está vazio</div>}
          {carrinho.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${cores.bordaForte}`, padding: '12px 0', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.nome}</span>
              <strong style={{ fontSize: '15px' }}>R$ {item.preco.toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', padding: '24px', backgroundColor: cores.bgGeral, borderRadius: '16px', border: '2px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: cores.textoSecundario, fontWeight: '700', fontSize: '18px' }}>TOTAL</span>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '32px', fontWeight: '800' }}>R$ {total.toFixed(2)}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
          <button onClick={() => { if (carrinho.length > 0) setModalAtual('selecao') }} style={{ gridColumn: 'span 2', backgroundColor: '#10b981', color: 'white', padding: '16px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgb(16 185 129 / 39%)' }}><CreditCard size={20} /> [F5] Finalizar Pagamento</button>
          <button onClick={() => setModalAtual('cliente')} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}><UserPlus size={18} /> [F8] Cliente</button>
          <button onClick={() => { setCarrinho([]); setClienteSelecionado(null); }} style={{ backgroundColor: '#ef4444', color: 'white', padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}><XCircle size={18} /> [F6] Cancelar</button>
        </div>
      </div>
    </div>
  );
}