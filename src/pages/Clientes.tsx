import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Users, Search, Plus, Edit, Trash2, ArrowLeft, X } from 'lucide-react';

const mockInicial = [
  { id: 1, nome: 'João Silva', cpf: '111.222.333-44', telefone: '(44) 99999-1111', fiado: 150.50 },
  { id: 2, nome: 'Maria Oliveira', cpf: '555.666.777-88', telefone: '(44) 98888-2222', fiado: 0.00 },
];

export function Clientes({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  // Estados da Tela
  const [busca, setBusca] = useState('');
  const [listaClientes, setListaClientes] = useState(mockInicial);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '' });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (modalAberto) setModalAberto(false);
    else aoVoltar();
  });

  const clientesFiltrados = listaClientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cpf.includes(busca)
  );

  const salvarCliente = () => {
    if (!form.nome) return alert('Preencha pelo menos o nome!');

    const novoCliente = {
      id: Math.random(), // Gera um ID falso
      nome: form.nome,
      cpf: form.cpf,
      telefone: form.telefone,
      fiado: 0.00
    };

    setListaClientes([...listaClientes, novoCliente]);
    setForm({ nome: '', cpf: '', telefone: '' }); // Limpa o form
    setModalAberto(false); // Fecha o modal
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <Users size={28} color="#8b5cf6" />
        <h2 style={{ margin: 0 }}>Gestão de Clientes</h2>
      </header>

      <div style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', width: '400px', border: `1px solid ${cores.borda}` }}>
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
            <Plus size={20} /> Novo Cliente
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: cores.bgPainel, borderRadius: '8px', overflow: 'hidden', boxShadow: cores.sombra }}>
          <thead>
            <tr style={{ backgroundColor: cores.borda, textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Nome</th>
              <th style={{ padding: '16px' }}>CPF</th>
              <th style={{ padding: '16px' }}>Telefone</th>
              <th style={{ padding: '16px' }}>Saldo Devedor</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(cliente => (
              <tr key={cliente.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                <td style={{ padding: '16px' }}>{cliente.nome}</td>
                <td style={{ padding: '16px' }}>{cliente.cpf}</td>
                <td style={{ padding: '16px' }}>{cliente.telefone}</td>
                <td style={{ padding: '16px', color: cliente.fiado > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>R$ {cliente.fiado.toFixed(2)}</td>
                <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <span style={{ cursor: 'pointer', display: 'flex' }} title="Editar"><Edit size={18} color="#3b82f6" /></span>
                  <span onClick={() => setListaClientes(listaClientes.filter(c => c.id !== cliente.id))} style={{ cursor: 'pointer', display: 'flex' }} title="Excluir"><Trash2 size={18} color="#ef4444" /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CADASTRO (Só aparece se modalAberto for true) */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '450px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Cadastrar Novo Cliente</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={() => setModalAberto(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Nome Completo</label>
                <input autoFocus value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>CPF</label>
                  <input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: cores.textoSecundario }}>Telefone</label>
                  <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setModalAberto(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: cores.borda, color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarCliente} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#8b5cf6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Cliente</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}