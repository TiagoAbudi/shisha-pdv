import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Shield, Search, Plus, Edit, Trash2, ArrowLeft, X, AlertCircle, UserCheck, Key, ShieldAlert } from 'lucide-react';

const mockInicial = [
  { id: 1, nome: 'Tiago Abudi', login: 'admin', perfil: 'Administrador', status: 'Ativo' },
  { id: 2, nome: 'Operador Manhã', login: 'caixa1', perfil: 'Caixa', status: 'Ativo' },
  { id: 3, nome: 'Operador Noite', login: 'caixa2', perfil: 'Caixa', status: 'Inativo' },
];

export function Usuarios({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  const [busca, setBusca] = useState('');
  const [listaUsuarios, setListaUsuarios] = useState(mockInicial);

  const [modalAberto, setModalAberto] = useState(false);
  const [erroForm, setErroForm] = useState('');
  
  const [form, setForm] = useState({
    nome: '', login: '', senha: '', perfil: 'Caixa', status: 'Ativo'
  });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (modalAberto) fecharModal();
    else aoVoltar();
  }, { enableOnFormTags: true });

  const usuariosFiltrados = listaUsuarios.filter(user =>
    user.nome.toLowerCase().includes(busca.toLowerCase()) ||
    user.login.toLowerCase().includes(busca.toLowerCase())
  );

  const fecharModal = () => {
    setModalAberto(false);
    setErroForm('');
    setForm({ nome: '', login: '', senha: '', perfil: 'Caixa', status: 'Ativo' });
  };

  const salvarUsuario = () => {
    setErroForm('');
    if (!form.nome.trim()) return setErroForm('O nome do usuário é obrigatório.');
    if (!form.login.trim()) return setErroForm('O login de acesso é obrigatório.');
    if (!form.senha.trim()) return setErroForm('Crie uma senha para o usuário.');

    const loginExiste = listaUsuarios.find(u => u.login === form.login);
    if (loginExiste) return setErroForm('Esse login já está em uso por outro usuário.');

    const novoUsuario = {
      id: Math.random(),
      nome: form.nome,
      login: form.login,
      perfil: form.perfil,
      status: form.status
    };

    setListaUsuarios([novoUsuario, ...listaUsuarios]);
    fecharModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <Shield size={28} color="#8b5cf6" />
        <h2 style={{ margin: 0 }}>Gestão de Usuários e Permissões</h2>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Dashboards Rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '10px' }}><UserCheck size={24} color="#8b5cf6" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Total de Usuários</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{listaUsuarios.length}</h3>
            </div>
          </div>
          
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '10px' }}><ShieldAlert size={24} color="#3b82f6" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Administradores</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#3b82f6' }}>{listaUsuarios.filter(u => u.perfil === 'Administrador').length}</h3>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', width: '400px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar por nome ou login..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>
          
          <button onClick={() => setModalAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Plus size={20} /> Novo Usuário
          </button>
        </div>

        <div style={{ flex: 1, backgroundColor: cores.bgPainel, borderRadius: '8px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: cores.bgPainel, zIndex: 1 }}>
              <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Nome Completo</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Login de Acesso</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Perfil / Nível</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(user => (
                <tr key={user.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                  <td style={{ padding: '16px', fontWeight: '600' }}>{user.nome}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px' }}>{user.login}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: user.perfil === 'Administrador' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: user.perfil === 'Administrador' ? '#3b82f6' : '#f59e0b', border: `1px solid ${user.perfil === 'Administrador' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}>
                      {user.perfil}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: user.status === 'Ativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: user.status === 'Ativo' ? '#10b981' : '#ef4444' }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <span style={{ cursor: 'pointer', display: 'flex' }} title="Editar"><Edit size={18} color="#3b82f6" /></span>
                    <span onClick={() => setListaUsuarios(listaUsuarios.filter(u => u.id !== user.id))} style={{ cursor: 'pointer', display: 'flex', opacity: user.login === 'admin' ? 0.3 : 1, pointerEvents: user.login === 'admin' ? 'none' : 'auto' }} title={user.login === 'admin' ? "Não é possível excluir o Admin mestre" : "Excluir Usuário"}>
                      <Trash2 size={18} color="#ef4444" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO DE USUÁRIO */}
      {modalAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '550px', borderRadius: '12px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            <div style={{ padding: '20px 24px', backgroundColor: cores.bgGeral, borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Shield color="#8b5cf6" size={20} /> Cadastrar Novo Usuário</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={fecharModal} />
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {erroForm && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: '500', fontSize: '14px' }}>
                  <AlertCircle size={20} /> {erroForm}
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Nome Completo *</label>
                <input autoFocus placeholder="Ex: João Silva" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Login de Acesso *</label>
                  <input placeholder="Ex: joao.caixa" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value.toLowerCase().replace(/\s/g, '') })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}><Key size={14}/> Senha Padrão *</label>
                  <input type="password" placeholder="******" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto }} />
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: cores.borda, margin: '8px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Nível de Permissão</label>
                  <select value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}>
                    <option value="Caixa">Operador de Caixa (Restrito)</option>
                    <option value="Administrador">Administrador (Acesso Total)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Status do Usuário</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, outline: 'none' }}>
                    <option value="Ativo">Ativo (Pode logar)</option>
                    <option value="Inativo">Inativo (Bloqueado)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: cores.bgGeral, borderTop: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={fecharModal} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarUsuario} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#8b5cf6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Usuário</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}