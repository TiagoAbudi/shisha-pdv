import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { Cloud, CloudOff, RefreshCw, Database, ArrowLeft, CheckCircle, AlertTriangle, HardDrive, Server, AlertCircle } from 'lucide-react';

// Mock simulando uma fila de dados locais aguardando envio para o Supabase
const mockFila = [
  { id: 1, tipo: 'Venda (NFC-e)', descricao: 'Cupom #000127 - R$ 150,00', data: '15/08/2026 15:42', status: 'Pendente' },
  { id: 2, tipo: 'Cliente', descricao: 'Novo cadastro: Lucas Mendes', data: '15/08/2026 15:50', status: 'Pendente' },
  { id: 3, tipo: 'Produto', descricao: 'Atualização de Estoque: Coca-Cola 2L', data: '15/08/2026 15:55', status: 'Erro' },
];

export function Sincronizacao({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filaSync, setFilaSync] = useState(mockFila);
  const [ultimaSync, setUltimaSync] = useState('15/08/2026 15:30');

  // Estado para substituir o alert nativo
  const [alerta, setAlerta] = useState<{ visivel: boolean; titulo: string; mensagem: string } | null>(null);

  // Monitora a conexão em tempo real
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (alerta?.visivel) {
      setAlerta(null);
    } else {
      aoVoltar();
    }
  }, { enableOnFormTags: true }, [alerta]);

  const forcarSincronizacao = () => {
    if (!isOnline) {
      setAlerta({ visivel: true, titulo: 'Modo Offline', mensagem: 'Não há conexão com a internet para forçar a sincronização com a nuvem no momento.' });
      return;
    }

    setIsSyncing(true);

    // Simula o tempo de envio dos dados do SQLite para o Supabase
    setTimeout(() => {
      setFilaSync([]); // Limpa a fila (tudo foi enviado)
      setUltimaSync(new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
      setIsSyncing(false);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${cores.borda}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
            <ArrowLeft size={24} />
          </div>
          {isOnline ? <Cloud size={28} color="#3b82f6" /> : <CloudOff size={28} color="#ef4444" />}
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Monitor de Nuvem (Supabase)</h2>
            <span style={{ color: cores.textoSecundario, fontSize: '13px' }}>Gestão de sincronização Offline-First</span>
          </div>
        </div>

        {/* Badge Dinâmico de Conexão */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isOnline ? '#10b981' : '#ef4444', boxShadow: `0 0 8px ${isOnline ? '#10b981' : '#ef4444'}` }} />
          <strong style={{ color: isOnline ? '#10b981' : '#ef4444', fontSize: '14px' }}>
            {isOnline ? 'Conectado à Nuvem' : 'Operando Offline (Local)'}
          </strong>
        </div>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>

        {/* Painel de Arquitetura de Dados */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center', backgroundColor: cores.bgPainel, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>

          {/* SQLite Local */}
          <div style={{ textAlign: 'center', padding: '24px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `2px solid ${cores.bordaForte}` }}>
            <HardDrive size={48} color="#f59e0b" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ margin: '0 0 8px 0' }}>Banco de Dados Local</h3>
            <span style={{ fontSize: '13px', color: cores.textoSecundario, display: 'block', marginBottom: '16px' }}>SQLite (Tauri)</span>
            <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>Gravando em tempo real</span>
          </div>

          {/* Seta de Sincronização */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={32} color={isSyncing ? '#3b82f6' : cores.textoSecundario} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: cores.textoSecundario }}>
              {isSyncing ? 'Enviando...' : 'Fila de Envio'}
            </span>
          </div>

          {/* Supabase Nuvem */}
          <div style={{ textAlign: 'center', padding: '24px', backgroundColor: cores.bgGeral, borderRadius: '12px', border: `2px solid ${isOnline ? '#10b981' : cores.bordaForte}`, opacity: isOnline ? 1 : 0.5, transition: 'all 0.3s' }}>
            <Server size={48} color="#10b981" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ margin: '0 0 8px 0' }}>Nuvem (Supabase)</h3>
            <span style={{ fontSize: '13px', color: cores.textoSecundario, display: 'block', marginBottom: '16px' }}>PostgreSQL</span>
            <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>Última Sync: {ultimaSync}</span>
          </div>
        </div>

        {/* Fila de Sincronização (Tabela) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: cores.bgPainel, borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${cores.borda}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: cores.bgGeral }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database color="#3b82f6" size={20} />
              <h3 style={{ margin: 0, fontSize: '16px' }}>Fila de Dados Pendentes ({filaSync.length})</h3>
            </div>
            <button
              onClick={forcarSincronizacao}
              disabled={isSyncing || filaSync.length === 0 || !isOnline}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: (isSyncing || filaSync.length === 0 || !isOnline) ? cores.bordaForte : '#3b82f6', color: (isSyncing || filaSync.length === 0 || !isOnline) ? cores.textoSecundario : '#fff', cursor: (isSyncing || filaSync.length === 0 || !isOnline) ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            >
              <RefreshCw size={16} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              {isSyncing ? 'Sincronizando...' : 'Forçar Sincronização'}
            </button>
          </div>

          <div style={{ overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                  <th style={{ padding: '16px 24px', color: cores.textoSecundario }}>Módulo</th>
                  <th style={{ padding: '16px 24px', color: cores.textoSecundario }}>Descrição do Registro</th>
                  <th style={{ padding: '16px 24px', color: cores.textoSecundario }}>Data Local</th>
                  <th style={{ padding: '16px 24px', color: cores.textoSecundario, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filaSync.map((item) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                    <td style={{ padding: '16px 24px', fontWeight: '600' }}>{item.tipo}</td>
                    <td style={{ padding: '16px 24px' }}>{item.descricao}</td>
                    <td style={{ padding: '16px 24px', color: cores.textoSecundario }}>{item.data}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      {item.status === 'Pendente' ? (
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          Aguardando Envio
                        </span>
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> Falha no Supabase
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filaSync.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '60px 24px', textAlign: 'center', color: cores.textoSecundario }}>
                      <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <br />
                      <strong style={{ fontSize: '16px', color: cores.texto }}>Tudo em dia!</strong>
                      <br />
                      Não há dados locais pendentes. O Supabase está 100% sincronizado com o SQLite.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL DE ALERTA CUSTOMIZADO (Substitui os alerts nativos) --- */}
      {alerta?.visivel && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertCircle size={28} color="#ef4444" />
              <h3 style={{ margin: 0, color: cores.texto }}>{alerta.titulo}</h3>
            </div>
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, lineHeight: '1.5' }}>
              {alerta.mensagem}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAlerta(null)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Entendi [ ESC ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS para a animação de giro do ícone */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}