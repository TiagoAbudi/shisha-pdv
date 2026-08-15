import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { FileText, Search, ArrowLeft, RefreshCw, XCircle, FileOutput, Filter, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

// Mock avançado simulando retorno da FocusNFe (UF 41 = Paraná)
const mockInicial = [
  { id: 1, num: '000123', chave: '4126 0800 0000 0000 0001 6500 1000 0001 2310 0000 0012', data: '11/08/2026 08:10', cliente: 'Consumidor Final', valor: 45.00, status: 'Autorizada', motivo: 'Autorizado o uso da NF-e' },
  { id: 2, num: '000124', chave: '4126 0800 0000 0000 0001 6500 1000 0001 2410 0000 0013', data: '11/08/2026 08:25', cliente: 'João Silva', valor: 119.90, status: 'Offline (Contingência)', motivo: 'Aguardando conexão com a internet para transmissão' },
  { id: 3, num: '000125', chave: '4126 0800 0000 0000 0001 6500 1000 0001 2510 0000 0014', data: '11/08/2026 09:15', cliente: 'Consumidor Final', valor: 35.00, status: 'Rejeitada', motivo: 'Rejeição 778: Informado NCM inexistente' },
  { id: 4, num: '000126', chave: '4126 0800 0000 0000 0001 6500 1000 0001 2610 0000 0015', data: '10/08/2026 18:45', cliente: 'Tiago Abudi', valor: 12.50, status: 'Cancelada', motivo: 'Cancelamento homologado' },
];

export function Notas({ aoVoltar }: { aoVoltar: () => void }) {
  const { cores } = useTheme();

  // Estados de Filtro e Lista
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [listaNotas, setListaNotas] = useState(mockInicial);

  // Estados de Modais Fiscais
  const [modalAtivo, setModalAtivo] = useState<'cancelar' | 'transmitir' | 'detalhes' | null>(null);
  const [notaSelecionada, setNotaSelecionada] = useState<any>(null);
  const [justificativa, setJustificativa] = useState('');
  
  // Estado para o feedback visual (Substitui os alerts)
  const [feedback, setFeedback] = useState<{ visivel: boolean; titulo: string; mensagem: string; icone: 'check' | 'printer' | 'refresh' } | null>(null);

  // Atalhos
  useHotkeys('esc', (e) => {
    e.preventDefault();
    if (feedback?.visivel) return; // Se estiver no meio do feedback, ignora o ESC
    if (modalAtivo) fecharModal();
    else aoVoltar();
  }, { enableOnFormTags: true });

  const fecharModal = () => {
    setModalAtivo(null);
    setNotaSelecionada(null);
    setJustificativa('');
  };

  const abrirModal = (acao: 'cancelar' | 'transmitir' | 'detalhes', nota: any) => {
    setNotaSelecionada(nota);
    setModalAtivo(acao);
  };

  // Funções de Ação com Feedback Customizado
  const dispararAcao = (tipo: 'cancelar' | 'imprimir' | 'transmitir') => {
    if (tipo === 'cancelar') {
      if (justificativa.length < 15) return;
      setFeedback({ visivel: true, titulo: 'Cancelamento Solicitado', mensagem: 'Enviando requisição para a API da FocusNFe...', icone: 'check' });
    } else if (tipo === 'imprimir') {
      setFeedback({ visivel: true, titulo: 'Imprimindo Cupom', mensagem: 'Enviando documento para a impressora padrão...', icone: 'printer' });
    } else if (tipo === 'transmitir') {
      setFeedback({ visivel: true, titulo: 'Transmitindo...', mensagem: 'Sincronizando lote pendente com a SEFAZ.', icone: 'refresh' });
    }

    // Aguarda 2.5 segundos para dar o feedback visual e depois fecha tudo
    setTimeout(() => {
      setFeedback(null);
      fecharModal();
    }, 2500);
  };

  // Lógica de Filtragem Múltipla
  const notasFiltradas = listaNotas.filter(nota => {
    const atendeBusca = nota.num.includes(busca) || nota.cliente.toLowerCase().includes(busca.toLowerCase()) || nota.chave.includes(busca);
    const atendeStatus = filtroStatus === 'Todos' || nota.status.includes(filtroStatus);
    return atendeBusca && atendeStatus;
  });

  // Cálculos para os KPIs (Indicadores de Performance)
  const totalAutorizado = listaNotas.filter(n => n.status === 'Autorizada').reduce((acc, n) => acc + n.valor, 0);
  const qtdOffline = listaNotas.filter(n => n.status.includes('Offline')).length;
  const qtdRejeitada = listaNotas.filter(n => n.status === 'Rejeitada').length;

  // Lógica de Cores Modernas
  const corDoStatus = (status: string) => {
    if (status.includes('Autorizada')) return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
    if (status.includes('Offline')) return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
    if (status.includes('Rejeitada')) return { bg: 'rgba(236, 72, 153, 0.1)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.3)' };
    return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' }; // Cancelada
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: cores.bgGeral, color: cores.texto, position: 'relative' }}>

      <header style={{ padding: '20px', backgroundColor: cores.header, display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${cores.borda}` }}>
        <div onClick={aoVoltar} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ArrowLeft size={24} />
        </div>
        <FileText size={28} color="#10b981" />
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Monitor Fiscal (NFC-e)</h2>
          <span style={{ color: cores.textoSecundario, fontSize: '13px' }}>Gestão de notas emitidas, contingência e retornos da SEFAZ</span>
        </div>
      </header>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        
        {/* KPIs (Indicadores Fiscais) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '10px' }}><CheckCircle size={24} color="#10b981" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Autorizadas (Hoje)</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>R$ {totalAutorizado.toFixed(2)}</h3>
            </div>
          </div>
          
          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${qtdOffline > 0 ? '#f59e0b' : cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '10px' }}><RefreshCw size={24} color="#f59e0b" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Em Contingência (Offline)</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', color: qtdOffline > 0 ? '#f59e0b' : cores.texto }}>{qtdOffline} nota(s) pendente(s)</h3>
            </div>
          </div>

          <div style={{ backgroundColor: cores.bgPainel, padding: '20px', borderRadius: '12px', border: `1px solid ${qtdRejeitada > 0 ? '#ec4899' : cores.borda}`, boxShadow: cores.sombra, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '10px' }}><AlertTriangle size={24} color="#ec4899" /></div>
            <div>
              <span style={{ color: cores.textoSecundario, fontSize: '13px', fontWeight: '600' }}>Rejeitadas pela SEFAZ</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', color: qtdRejeitada > 0 ? '#ec4899' : cores.texto }}>{qtdRejeitada} nota(s) com erro</h3>
            </div>
          </div>
        </div>

        {/* Barra de Filtros Avançada */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '10px 16px', border: `1px solid ${cores.borda}` }}>
            <Search size={20} color={cores.textoSecundario} style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Pesquisar por Nº da Nota, Chave de Acesso ou Cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, width: '100%', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: cores.bgInput, borderRadius: '8px', padding: '0 16px', border: `1px solid ${cores.borda}` }}>
            <Filter size={18} color={cores.textoSecundario} style={{ marginRight: '8px' }} />
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ border: 'none', backgroundColor: 'transparent', color: cores.texto, height: '100%', outline: 'none', fontWeight: '500' }}>
              <option value="Todos" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Todos os Status</option>
              <option value="Autorizada" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Apenas Autorizadas</option>
              <option value="Offline" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Offline / Contingência</option>
              <option value="Rejeitada" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Rejeitadas</option>
              <option value="Cancelada" style={{ backgroundColor: cores.bgPainel, color: cores.texto }}>Canceladas</option>
            </select>
          </div>
        </div>

        {/* Tabela Fiscal Profissional */}
        <div style={{ backgroundColor: cores.bgPainel, borderRadius: '8px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${cores.bordaForte}` }}>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Nº / Série</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Emissão</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Cliente</th>
                <th style={{ padding: '16px', color: cores.textoSecundario }}>Chave de Acesso</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'right' }}>Valor Total</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Status SEFAZ</th>
                <th style={{ padding: '16px', color: cores.textoSecundario, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map(nota => {
                const cor = corDoStatus(nota.status);

                return (
                  <tr key={nota.id} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                    <td style={{ padding: '16px' }}>
                      <strong style={{ display: 'block' }}>{nota.num}</strong>
                      <span style={{ fontSize: '12px', color: cores.textoSecundario }}>Série: 1</span>
                    </td>
                    <td style={{ padding: '16px', color: cores.textoSecundario, fontSize: '13px' }}>{nota.data}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{nota.cliente}</td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: cores.textoSecundario, letterSpacing: '0.5px' }}>
                      {nota.chave}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', textAlign: 'right' }}>R$ {nota.valor.toFixed(2)}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', backgroundColor: cor.bg, color: cor.text, border: `1px solid ${cor.border}`, cursor: 'pointer' }} onClick={() => abrirModal('detalhes', nota)} title="Clique para ver o retorno da SEFAZ">
                        {nota.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <span onClick={() => abrirModal('detalhes', nota)} style={{ cursor: 'pointer', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}` }} title="Detalhes / Imprimir">
                        <FileOutput size={18} color="#3b82f6" />
                      </span>
                      <span onClick={() => nota.status.includes('Offline') || nota.status === 'Rejeitada' ? abrirModal('transmitir', nota) : null} style={{ cursor: nota.status.includes('Offline') || nota.status === 'Rejeitada' ? 'pointer' : 'not-allowed', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}`, opacity: nota.status.includes('Offline') || nota.status === 'Rejeitada' ? 1 : 0.3 }} title="Retransmitir para SEFAZ">
                        <RefreshCw size={18} color="#f59e0b" />
                      </span>
                      <span onClick={() => nota.status === 'Autorizada' ? abrirModal('cancelar', nota) : null} style={{ cursor: nota.status === 'Autorizada' ? 'pointer' : 'not-allowed', display: 'flex', padding: '6px', backgroundColor: cores.bgGeral, borderRadius: '6px', border: `1px solid ${cores.bordaForte}`, opacity: nota.status === 'Autorizada' ? 1 : 0.3 }} title="Cancelar Nota">
                        <XCircle size={18} color="#ef4444" />
                      </span>
                    </td>
                  </tr>
                )
              })}

              {notasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 24px', textAlign: 'center', color: cores.textoSecundario }}>
                    <FileText size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
                    <br/>
                    Nenhuma nota fiscal encontrada para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAIS FISCAIS PROFISSIONAIS --- */}

      {/* Modal 1: Cancelamento de NFC-e */}
      {modalAtivo === 'cancelar' && notaSelecionada && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '500px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}><AlertTriangle /> Cancelar NFC-e {notaSelecionada.num}</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={fecharModal} />
            </div>
            
            <p style={{ color: cores.textoSecundario, marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
              A SEFAZ exige uma justificativa válida com <strong>pelo menos 15 caracteres</strong> para autorizar o cancelamento desta nota. Esta ação é irreversível.
            </p>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Justificativa do Cancelamento:</label>
            <textarea 
              autoFocus
              placeholder="Ex: Cliente desistiu da compra logo após a emissão..."
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: cores.bgInput, color: cores.texto, minHeight: '100px', outline: 'none', resize: 'none', marginBottom: '24px', fontFamily: 'inherit' }} 
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={fecharModal} style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Voltar</button>
              <button 
                onClick={() => dispararAcao('cancelar')} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: justificativa.length >= 15 ? '#ef4444' : cores.bordaForte, color: '#fff', cursor: justificativa.length >= 15 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Detalhes e Retorno SEFAZ */}
      {modalAtivo === 'detalhes' && notaSelecionada && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '500px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Info color="#3b82f6" /> Detalhes da Nota {notaSelecionada.num}</h3>
              <X size={24} style={{ cursor: 'pointer', color: cores.textoSecundario }} onClick={fecharModal} />
            </div>

            <div style={{ backgroundColor: cores.bgGeral, border: `1px solid ${cores.bordaForte}`, borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              <span style={{ display: 'block', fontSize: '12px', color: cores.textoSecundario, marginBottom: '4px', textTransform: 'uppercase' }}>Mensagem de Retorno da SEFAZ</span>
              <strong style={{ fontSize: '15px', color: notaSelecionada.status === 'Rejeitada' ? '#ec4899' : cores.texto, lineHeight: '1.4' }}>
                {notaSelecionada.motivo}
              </strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div>
                <span style={{ fontSize: '12px', color: cores.textoSecundario, display: 'block' }}>Valor Total</span>
                <strong style={{ fontSize: '16px' }}>R$ {notaSelecionada.valor.toFixed(2)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: cores.textoSecundario, display: 'block' }}>Cliente</span>
                <strong style={{ fontSize: '16px' }}>{notaSelecionada.cliente}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={fecharModal} style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${cores.bordaForte}`, backgroundColor: 'transparent', color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Fechar</button>
              <button onClick={() => dispararAcao('imprimir')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileOutput size={18} /> Imprimir Cupom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Transmitir / Tentar Novamente */}
      {modalAtivo === 'transmitir' && notaSelecionada && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '12px', padding: '24px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '50%' }}>
                <RefreshCw size={32} color="#f59e0b" />
              </div>
            </div>
            <h3 style={{ margin: '0 0 12px 0' }}>Transmitir NFC-e</h3>
            <p style={{ margin: '0 0 24px 0', color: cores.textoSecundario, fontSize: '14px', lineHeight: '1.5' }}>
              Deseja tentar enviar a nota <strong>{notaSelecionada.num}</strong> para a SEFAZ novamente? Certifique-se de que a conexão com a internet está ativa.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button onClick={fecharModal} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgGeral, color: cores.texto, cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={() => dispararAcao('transmitir')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Sim, Transmitir</button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK VISUAL GLOBAL (Substitui os alerts) */}
      {feedback?.visivel && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cores.bgPainel, width: '400px', borderRadius: '16px', padding: '48px', border: `1px solid ${cores.borda}`, boxShadow: cores.sombra, textAlign: 'center' }}>
            <div style={{ backgroundColor: feedback.icone === 'check' ? 'rgba(16, 185, 129, 0.1)' : feedback.icone === 'printer' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              {feedback.icone === 'check' && <CheckCircle size={48} color="#10b981" />}
              {feedback.icone === 'printer' && <FileOutput size={48} color="#3b82f6" />}
              {feedback.icone === 'refresh' && <RefreshCw size={48} color="#f59e0b" style={{ animation: 'spin 1s linear infinite' }} />}
            </div>
            <h2 style={{ color: feedback.icone === 'check' ? '#10b981' : feedback.icone === 'printer' ? '#3b82f6' : '#f59e0b', fontSize: '24px', marginBottom: '8px' }}>
              {feedback.titulo}
            </h2>
            <p style={{ color: cores.textoSecundario, fontWeight: '500' }}>{feedback.mensagem}</p>
          </div>
        </div>
      )}

      {/* CSS para a animação de giro do ícone de transmitir */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}