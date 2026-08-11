import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ShoppingCart, Package, FileText, Settings, Users, LogOut, BarChart3, X, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Telas } from '../types';

export function Dashboard({ mudarTela }: { mudarTela: (tela: Telas) => void }) {
  const { cores } = useTheme();

  // Estados para controlar os modais customizados
  const [modalSairAberto, setModalSairAberto] = useState(false);
  const [alertaCustomizado, setAlertaCustomizado] = useState({ aberto: false, titulo: '', mensagem: '' });

  // Função para abrir o alerta customizado
  const mostrarAlerta = (titulo: string, mensagem: string) => {
    setAlertaCustomizado({ aberto: true, titulo, mensagem });
  };

  useHotkeys('f2', (e) => { e.preventDefault(); mudarTela('caixa'); });
  useHotkeys('f3', (e) => { e.preventDefault(); mudarTela('produtos'); });
  useHotkeys('f4', (e) => { e.preventDefault(); mudarTela('notas'); });
  useHotkeys('f7', (e) => { e.preventDefault(); mudarTela('clientes'); });
  useHotkeys('f9', (e) => { e.preventDefault(); mudarTela('relatorios'); });
  useHotkeys('f10', (e) => { e.preventDefault(); mudarTela('configuracoes'); });

  // O ESC agora fecha os modais primeiro. Se não tiver modal aberto, ele pede para sair.
  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (alertaCustomizado.aberto) {
      setAlertaCustomizado({ ...alertaCustomizado, aberto: false });
    } else if (modalSairAberto) {
      setModalSairAberto(false);
    } else {
      setModalSairAberto(true);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ backgroundColor: cores.header, color: cores.texto, padding: '8px 20px', display: 'flex', gap: '24px', fontSize: '13px', fontWeight: '500', borderBottom: `1px solid ${cores.borda}` }}>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mostrarAlerta('Arquivo', 'Menu Arquivo em desenvolvimento.')}>Arquivo</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('clientes')}>Cadastros</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('produtos')}>Estoque</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('notas')}>Fiscal</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('relatorios')}>Relatórios</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('configuracoes')}>Configurações</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mostrarAlerta('Sobre o Sistema', 'Sistema de PDV Shisha Conveniência v1.0\n\nAtalhos do Teclado:\n[F2] Caixa\n[F3] Produtos\n[F4] Notas\n[F7] Clientes\n[F9] Relatórios\n[F10] Configurações\n[ESC] Sair')}>Ajuda</div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', backgroundColor: cores.bgPainel, borderBottom: `1px solid ${cores.borda}` }}>
        <strong style={{ fontSize: '18px' }}>Visão Geral</strong>
        <span style={{ fontSize: '14px', color: cores.textoSecundario }}>Operador: <strong style={{ color: cores.texto }}>Admin</strong> | <span style={{ color: '#10b981', fontWeight: '600' }}>● Online</span></span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '1000px', width: '100%' }}>

          {[
            { icon: <ShoppingCart size={40} color="#3b82f6" />, title: 'Frente de Caixa', sub: '[ F2 ]', action: 'caixa', bg: 'rgba(59, 130, 246, 0.1)' },
            { icon: <Package size={40} color="#f59e0b" />, title: 'Estoque', sub: '[ F3 ]', action: 'produtos', bg: 'rgba(245, 158, 11, 0.1)' },
            { icon: <FileText size={40} color="#10b981" />, title: 'Notas Fiscais', sub: '[ F4 ]', action: 'notas', bg: 'rgba(16, 185, 129, 0.1)' },
            { icon: <Users size={40} color="#8b5cf6" />, title: 'Clientes / Fiado', sub: '[ F7 ]', action: 'clientes', bg: 'rgba(139, 92, 246, 0.1)' },
            { icon: <BarChart3 size={40} color="#ec4899" />, title: 'Relatórios', sub: '[ F9 ]', action: 'relatorios', bg: 'rgba(236, 72, 153, 0.1)' },
            { icon: <Settings size={40} color="#64748b" />, title: 'Configurações', sub: '[ F10 ]', action: 'configuracoes', bg: 'rgba(100, 116, 139, 0.1)' },
            { icon: <LogOut size={40} color="#ef4444" />, title: 'Sair do Sistema', sub: '[ ESC ]', action: 'login', bg: 'rgba(239, 68, 68, 0.1)', colorText: '#ef4444' },
          ].map((btn, i) => (
            <button
              key={i}
              // Se a ação for login, abrimos o modal. Senão, mudamos de tela normalmente.
              onClick={() => btn.action === 'login' ? setModalSairAberto(true) : mudarTela(btn.action as Telas)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: cores.bgPainel, border: `1px solid ${cores.borda}`, borderRadius: '16px', cursor: 'pointer', color: btn.colorText || cores.texto, boxShadow: cores.sombra, transition: 'transform 0.2s' }}
            >
              <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: btn.bg, marginBottom: '20px' }}>
                {btn.icon}
              </div>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>{btn.title}</span>
              <span style={{ fontSize: '13px', color: cores.textoSecundario, marginTop: '8px', fontWeight: '500' }}>Atalho: {btn.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- MODAIS SOBREPOSTOS --- */}

      {/* 1. Modal de Confirmação de Saída */}
      {modalSairAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '50%' }}>
                <LogOut size={32} color="#ef4444" />
              </div>
            </div>
            <h3 style={{ margin: '0 0 12px 0' }}>Sair do Sistema</h3>
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario }}>Tem certeza de que deseja encerrar a sessão atual e voltar para a tela de login?</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button onClick={() => setModalSairAberto(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgGeral, color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button onClick={() => mudarTela('login')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal de Alerta / Informação (Substitui o alert() nativo) */}
      {alertaCustomizado.aberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '450px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={24} color="#3b82f6" />
                <h3 style={{ margin: 0 }}>{alertaCustomizado.titulo}</h3>
              </div>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={() => setAlertaCustomizado({ ...alertaCustomizado, aberto: false })} />
            </div>

            {/* O white-space: pre-wrap permite que os \n do texto funcionem como quebra de linha */}
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {alertaCustomizado.mensagem}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAlertaCustomizado({ ...alertaCustomizado, aberto: false })} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}