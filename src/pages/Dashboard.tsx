import { useState, useRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ShoppingCart, Package, FileText, Settings, Users, LogOut, BarChart3, X, Info, CreditCard, Keyboard, Headset, User, Cloud, TrendingUp, Wallet, AlertCircle, Clock, ChevronDown, Save, Printer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Telas } from '../types';

export function Dashboard({ mudarTela }: { mudarTela: (tela: Telas) => void }) {
  const { cores } = useTheme();

  const [modalSairAberto, setModalSairAberto] = useState(false);
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false);
  const [alertaCustomizado, setAlertaCustomizado] = useState({ aberto: false, titulo: '', mensagem: '' });

  // Controle do Menu Dropdown "Arquivo"
  const [menuArquivoAberto, setMenuArquivoAberto] = useState(false);
  const menuArquivoRef = useRef<HTMLDivElement>(null);

  // Fecha o menu "Arquivo" se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuArquivoRef.current && !menuArquivoRef.current.contains(event.target as Node)) {
        setMenuArquivoAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    setAlertaCustomizado({ aberto: true, titulo, mensagem });
  };

  useHotkeys('f2', (e) => { e.preventDefault(); mudarTela('caixa'); });
  useHotkeys('f3', (e) => { e.preventDefault(); mudarTela('produtos'); });
  useHotkeys('f4', (e) => { e.preventDefault(); mudarTela('notas'); });
  useHotkeys('f6', (e) => { e.preventDefault(); mudarTela('contas'); });
  useHotkeys('f7', (e) => { e.preventDefault(); mudarTela('clientes'); });
  useHotkeys('f8', (e) => { e.preventDefault(); mudarTela('usuarios'); });
  useHotkeys('f9', (e) => { e.preventDefault(); mudarTela('relatorios'); });
  useHotkeys('f10', (e) => { e.preventDefault(); mudarTela('configuracoes'); });
  useHotkeys('f11', (e) => { e.preventDefault(); mudarTela('sincronizacao'); });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (menuArquivoAberto) {
      setMenuArquivoAberto(false);
    } else if (modalAjudaAberto) {
      setModalAjudaAberto(false);
    } else if (alertaCustomizado.aberto) {
      setAlertaCustomizado({ ...alertaCustomizado, aberto: false });
    } else if (modalSairAberto) {
      setModalSairAberto(false);
    } else {
      setModalSairAberto(true);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      {/* HEADER / MENU SUPERIOR */}
      <header style={{ backgroundColor: cores.header, color: cores.texto, padding: '8px 20px', display: 'flex', gap: '24px', fontSize: '13px', fontWeight: '500', borderBottom: `1px solid ${cores.borda}` }}>

        {/* Menu Arquivo Dropdown */}
        <div style={{ position: 'relative' }} ref={menuArquivoRef}>
          <div
            style={{ cursor: 'pointer', opacity: menuArquivoAberto ? 1 : 0.8, display: 'flex', alignItems: 'center', gap: '4px', color: menuArquivoAberto ? '#3b82f6' : cores.texto, fontWeight: menuArquivoAberto ? 'bold' : '500' }}
            onClick={() => setMenuArquivoAberto(!menuArquivoAberto)}
          >
            Arquivo <ChevronDown size={14} style={{ transform: menuArquivoAberto ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>

          {menuArquivoAberto && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', backgroundColor: cores.bgPainel, border: `1px solid ${cores.borda}`, borderRadius: '8px', boxShadow: cores.sombra, width: '220px', zIndex: 100, overflow: 'hidden', animation: 'fadeIn 0.2s' }}>
              <div
                onClick={() => { setMenuArquivoAberto(false); mostrarAlerta('Backup Local', 'Gerando cópia de segurança do banco de dados SQLite para download...'); }}
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: `1px solid ${cores.borda}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cores.bgGeral}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Save size={16} color={cores.textoSecundario} /> Fazer Backup Local
              </div>
              <div
                onClick={() => { setMenuArquivoAberto(false); mostrarAlerta('Configurar Impressora', 'Integração com Spooler do Windows e porta COM em desenvolvimento.'); }}
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: `1px solid ${cores.borda}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cores.bgGeral}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Printer size={16} color={cores.textoSecundario} /> Configurar Impressora
              </div>
              <div
                onClick={() => { setMenuArquivoAberto(false); mudarTela('login'); }}
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: `1px solid ${cores.borda}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cores.bgGeral}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={16} color={cores.textoSecundario} /> Trocar Operador
              </div>
              <div
                onClick={() => { setMenuArquivoAberto(false); setModalSairAberto(true); }}
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#ef4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={16} color="#ef4444" /> Encerrar Sistema
              </div>
            </div>
          )}
        </div>

        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('clientes')}>Cadastros</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('produtos')}>Estoque</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('notas')}>Fiscal</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('contas')}>Contas</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('usuarios')}>Usuários</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('relatorios')}>Relatórios</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => mudarTela('configuracoes')}>Configurações</div>
        <div style={{ cursor: 'pointer', opacity: 0.8, color: '#3b82f6', fontWeight: 'bold' }} onClick={() => mudarTela('sincronizacao')}>Nuvem</div>
        <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setModalAjudaAberto(true)}>Ajuda</div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', backgroundColor: cores.bgPainel, borderBottom: `1px solid ${cores.borda}` }}>
        <strong style={{ fontSize: '18px' }}>Visão Geral do Negócio</strong>
        <span style={{ fontSize: '14px', color: cores.textoSecundario }}>Operador: <strong style={{ color: cores.texto }}>Admin</strong> | <span style={{ color: '#10b981', fontWeight: '600' }}>● Online</span></span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>

        {/* --- NOVA SEÇÃO: KPIs (INDICADORES CHAVE) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px', maxWidth: '1400px', margin: '0 auto 32px auto', width: '100%' }}>

          {/* KPI 1: Vendas Hoje */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px' }}>
              <TrendingUp size={28} color="#10b981" />
            </div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vendas Hoje</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: cores.texto }}>R$ 1.840,50</h3>
            </div>
          </div>

          {/* KPI 2: Fundo de Caixa */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '12px' }}>
              <Wallet size={28} color="#3b82f6" />
            </div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fundo de Caixa</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: cores.texto }}>R$ 350,00</h3>
            </div>
          </div>

          {/* KPI 3: Contas Vencendo Hoje */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px' }}>
              <AlertCircle size={28} color="#ef4444" />
            </div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pagar (Hoje)</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: cores.texto }}>2 Boletos</h3>
            </div>
          </div>

          {/* KPI 4: Fiados a Receber */}
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '12px' }}>
              <Clock size={28} color="#8b5cf6" />
            </div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fiados Pendentes</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: cores.texto }}>R$ 4.250,00</h3>
            </div>
          </div>

        </div>

        {/* --- GRID DE BOTÕES REFINADO (5 Colunas) --- */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', maxWidth: '1400px', width: '100%' }}>
            {[
              { icon: <ShoppingCart size={36} color="#3b82f6" />, title: 'Frente de Caixa', sub: '[ F2 ]', action: 'caixa', bg: 'rgba(59, 130, 246, 0.1)' },
              { icon: <Package size={36} color="#f59e0b" />, title: 'Estoque', sub: '[ F3 ]', action: 'produtos', bg: 'rgba(245, 158, 11, 0.1)' },
              { icon: <FileText size={36} color="#10b981" />, title: 'Notas Fiscais', sub: '[ F4 ]', action: 'notas', bg: 'rgba(16, 185, 129, 0.1)' },
              { icon: <CreditCard size={36} color="#06b6d4" />, title: 'Contas a Pagar', sub: '[ F6 ]', action: 'contas', bg: 'rgba(6, 182, 212, 0.1)' },
              { icon: <Users size={36} color="#8b5cf6" />, title: 'Clientes / Fiado', sub: '[ F7 ]', action: 'clientes', bg: 'rgba(139, 92, 246, 0.1)' },
              { icon: <User size={36} color="#10b981" />, title: 'Usuários', sub: '[ F8 ]', action: 'usuarios', bg: 'rgba(16, 185, 129, 0.1)' },
              { icon: <BarChart3 size={36} color="#ec4899" />, title: 'Relatórios', sub: '[ F9 ]', action: 'relatorios', bg: 'rgba(236, 72, 153, 0.1)' },
              { icon: <Settings size={36} color="#64748b" />, title: 'Configurações', sub: '[ F10 ]', action: 'configuracoes', bg: 'rgba(100, 116, 139, 0.1)' },
              { icon: <Cloud size={36} color="#0ea5e9" />, title: 'Sincronização', sub: '[ F11 ]', action: 'sincronizacao', bg: 'rgba(14, 165, 233, 0.1)' },
              { icon: <LogOut size={36} color="#ef4444" />, title: 'Sair do Sistema', sub: '[ ESC ]', action: 'login', bg: 'rgba(239, 68, 68, 0.1)', colorText: '#ef4444' },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => btn.action === 'login' ? setModalSairAberto(true) : mudarTela(btn.action as Telas)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 16px', backgroundColor: cores.bgPainel, border: `1px solid ${cores.borda}`, borderRadius: '16px', cursor: 'pointer', color: btn.colorText || cores.texto, boxShadow: cores.sombra, transition: 'all 0.2s', height: '100%' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: btn.bg, marginBottom: '16px' }}>
                  {btn.icon}
                </div>
                <span style={{ fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap' }}>{btn.title}</span>
                <span style={{ fontSize: '12px', color: cores.textoSecundario, marginTop: '8px', fontWeight: '500' }}>Atalho: {btn.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODAIS SOBREPOSTOS --- */}

      {modalAjudaAberto && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '480px', borderRadius: '16px', padding: '0', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>

            <div style={{ padding: '24px', borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: cores.bgGeral }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#3b82f6', padding: '10px', borderRadius: '10px' }}>
                  <Info size={24} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: cores.texto, fontSize: '18px' }}>Sobre o Sistema</h3>
                  <span style={{ color: cores.textoSecundario, fontSize: '13px' }}>PDV Shisha Conveniência</span>
                </div>
              </div>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={() => setModalAjudaAberto(false)} />
            </div>

            <div style={{ padding: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: cores.texto, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Keyboard size={18} color="#8b5cf6" /> Atalhos do Teclado
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {[
                  { key: 'F2', label: 'Caixa' },
                  { key: 'F3', label: 'Produtos' },
                  { key: 'F4', label: 'Notas' },
                  { key: 'F6', label: 'Contas' },
                  { key: 'F7', label: 'Clientes' },
                  { key: 'F8', label: 'Usuários' },
                  { key: 'F9', label: 'Relatórios' },
                  { key: 'F10', label: 'Configurações' },
                  { key: 'F11', label: 'Nuvem/Sync' },
                  { key: 'ESC', label: 'Sair' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: cores.textoSecundario }}>
                    <span style={{ backgroundColor: cores.bgGeral, border: `1px solid ${cores.bordaForte}`, padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', color: cores.texto, fontSize: '12px', width: '38px', textAlign: 'center', boxShadow: '0 2px 0 rgba(0,0,0,0.1)' }}>
                      {item.key}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', backgroundColor: cores.borda, margin: '24px 0' }} />

              <h4 style={{ margin: '0 0 16px 0', color: cores.texto, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Headset size={18} color="#10b981" /> Suporte Técnico
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <span style={{ display: 'block', color: cores.texto, fontWeight: '600', marginBottom: '4px' }}>Precisa de ajuda?</span>
                  <span style={{ fontSize: '13px', color: cores.textoSecundario }}>Fale com o suporte.</span>
                </div>
                <strong style={{ color: '#10b981', fontSize: '16px', backgroundColor: '#fff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #10b981' }}>
                  (44) 99161-9288
                </strong>
              </div>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: cores.bgGeral, borderTop: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '500' }}>Versão 1.0.0</span>
              <button onClick={() => setModalAjudaAberto(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Entendi
              </button>
            </div>

          </div>
        </div>
      )}

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