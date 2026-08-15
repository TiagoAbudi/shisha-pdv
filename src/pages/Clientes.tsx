import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Users, Search, Plus, Edit, Trash2, ArrowLeft, X, AlertCircle, MapPin, CreditCard, User } from 'lucide-react';

const mockInicial = [
  { id: 1, nome: 'João Silva', cpf: '111.222.333-44', telefone: '(44) 99999-1111', email: 'joao.silva@email.com', cidade: 'Maringá/PR', limite: 500.00, fiado: 150.50 },
  { id: 2, nome: 'Maria Oliveira', cpf: '555.666.777-88', telefone: '(44) 98888-2222', email: 'maria@email.com', cidade: 'Sarandi/PR', limite: 300.00, fiado: 0.00 },
  { id: 3, nome: 'Lucas Mendes', cpf: '999.888.777-66', telefone: '(44) 97777-3333', email: 'lucas.mendes@email.com', cidade: 'Maringá/PR', limite: 200.00, fiado: 195.00 },
];

export function Clientes({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  // Estados da Tela
  const [busca, setBusca] = useState('');
  const [listaClientes, setListaClientes] = useState(mockInicial);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [erroForm, setErroForm] = useState('');
  const [form, setForm] = useState({
    nome: '', cpf: '', telefone: '', email: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: 'PR',
    limite: ''
  });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (modalAberto) fecharModal();
    else aoVoltar();
  }, { enableOnFormTags: true });

  const clientesFiltrados = listaClientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cpf.includes(busca)
  );

  const totalReceber = listaClientes.reduce((acc, c) => acc + c.fiado, 0);

  const fecharModal = () => {
    setModalAberto(false);
    setErroForm('');
    setForm({ nome: '', cpf: '', telefone: '', email: '', cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: 'PR', limite: '' });
  };

  const salvarCliente = () => {
    setErroForm('');

    // Validação Profissional
    if (!form.nome.trim()) return setErroForm('O nome do cliente é obrigatório.');
    if (!form.telefone.trim() && !form.cpf.trim()) return setErroForm('Informe ao menos o CPF ou o Telefone para contato.');

    const novoCliente = {
      id: Math.random(),
      nome: form.nome,
      cpf: form.cpf || 'Não informado',
      telefone: form.telefone || 'Não informado',
      email: form.email,
      cidade: form.cidade ? `${form.cidade}/${form.uf}` : 'Não informada',
      limite: parseFloat(form.limite.replace(',', '.')) || 0,
      fiado: 0.00 // Todo cliente novo começa com 0 de dívida
    };

    setListaClientes([novoCliente, ...listaClientes]);
    fecharModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <Users size={28} color="#8b5cf6" />
        <h2 style={{ margin: 0 }}>Gestão de Clientes e Crediário</h2>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '10px' }}><Users size={24} color="#8b5cf6" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Clientes Cadastrados</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{listaClientes.length}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '10px' }}><CreditCard size={24} color="#ef4444" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Total a Receber (Fiado)</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#ef4444' }}>R$ {totalReceber.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', width: '450px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>
          <button
            onClick={() => setModalAberto(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <Plus size={20} /> Cadastrar Cliente
          </button>
        </div>

        <div style={{ flex: 1, backgroundColor: cores.bgPainel, borderRadius: '8px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: cores.bgPainel, zIndex: 1 }}>
              <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Cliente / Email</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Documento (CPF)</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Contato / Cidade</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Financeiro (Fiado)</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(cliente => {
                const percentualUso = cliente.limite > 0 ? (cliente.fiado / cliente.limite) * 100 : 0;
                let corFiado = '#10b981'; // Verde (tranquilo)
                if (percentualUso > 70) corFiado = '#f59e0b'; // Amarelo (atenção)
                if (percentualUso >= 100) corFiado = '#ef4444'; // Vermelho (estourado)
                if (cliente.fiado === 0) corFiado = cores.textoSecundario; // Sem dívida

                return (
                  <tr key={cliente.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                    <td style={{ padding: '16px' }}>
                      <strong style={{ display: 'block', fontSize: '15px' }}>{cliente.nome}</strong>
                      {cliente.email && <span style={{ fontSize: '12px', color: cores.textoSecundario }}>{cliente.email}</span>}
                    </td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px' }}>{cliente.cpf}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'block' }}>{cliente.telefone}</span>
                      <span style={{ fontSize: '12px', color: cores.textoSecundario }}>{cliente.cidade}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {cliente.fiado > 0 ? (
                        <div>
                          <strong style={{ color: corFiado, display: 'block', fontSize: '15px' }}>R$ {cliente.fiado.toFixed(2)}</strong>
                          <span style={{ fontSize: '11px', color: cores.textoSecundario }}>Limite: R$ {cliente.limite.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span style={{ color: cores.textoSecundario, fontWeight: '500' }}>Sem débitos</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                      <span style={{ cursor: 'pointer', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}` }} title="Editar"><Edit size={18} color="#3b82f6" /></span>
                      <span onClick={() => setListaClientes(listaClientes.filter(c => c.id !== cliente.id))} style={{ cursor: 'pointer', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}` }} title="Excluir"><Trash2 size={18} color="#ef4444" /></span>
                    </td>
                  </tr>
                )
              })}

              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 24px', textAlign: 'center', color: cores.textoSecundario }}>
                    <Users size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
                    <br />
                    Nenhum cliente encontrado para "{busca}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO PROFISSIONAL */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '650px', borderRadius: '12px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            <div style={{ padding: '20px 24px', backgroundColor: cores.bgGeral, borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><User color="#8b5cf6" size={20} /> Cadastrar Novo Cliente</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={fecharModal} />
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto' }}>

              {erroForm && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: '500', fontSize: '14px' }}>
                  <AlertCircle size={20} /> {erroForm}
                </div>
              )}

              {/* DADOS PESSOAIS */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: cores.textoSecundario, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dados Pessoais</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Nome Completo *</label>
                    <input autoFocus value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>CPF</label>
                    <input placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: cores.borda }} />

              {/* CONTATO E ENDEREÇO */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: cores.textoSecundario, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Contato e Endereço</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Celular / WhatsApp</label>
                    <input placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>E-mail</label>
                    <input type="email" placeholder="cliente@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>CEP</label>
                    <input value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Endereço (Rua/Av)</label>
                    <input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Nº</label>
                    <input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Bairro</label>
                    <input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Cidade</label>
                    <input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>UF</label>
                    <input maxLength={2} value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, textAlign: 'center' }} />
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: cores.borda }} />

              {/* FINANCEIRO */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: cores.textoSecundario, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={16} /> Financeiro e Crédito</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Limite de Fiado (R$)</label>
                    <input type="number" step="0.01" value={form.limite} onChange={(e) => setForm({ ...form, limite: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `2px solid #8b5cf6`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontSize: '12px', color: cores.textoSecundario, margin: 0, padding: '10px' }}>
                      O sistema bloqueará vendas no fiado caso o saldo devedor do cliente ultrapasse este limite configurado. Deixe 0 ou em branco para não permitir fiado.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ padding: '16px 24px', backgroundColor: cores.bgGeral, borderTop: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={fecharModal} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarCliente} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#8b5cf6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Cliente</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}