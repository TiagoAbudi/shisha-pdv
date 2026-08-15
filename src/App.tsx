import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Telas } from './types';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { FrenteDeCaixa } from './pages/FrenteDeCaixa';
import { Configuracoes } from './pages/Configuracoes';
import { Produtos } from './pages/Produtos';
import { Notas } from './pages/Notas';
import { Clientes } from './pages/Clientes';
import { Relatorios } from './pages/Relatorios';
import { ContasPagar } from './pages/ContasPagar';
import { Usuarios } from './pages/Usuarios';
import { Sincronizacao } from './pages/Sincronizacao'; // <-- Importação nova
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css';

function AppContent() {
  const [telaAtual, setTelaAtual] = useState<Telas>('login');

  const irPara = (tela: Telas) => setTelaAtual(tela);

  useHotkeys('f5', (e) => {
    e.preventDefault();
  }, { enableOnFormTags: true });

  return (
    <>
      {telaAtual === 'login' && <Login aoLogar={() => irPara('dashboard')} />}
      {telaAtual === 'dashboard' && <Dashboard mudarTela={irPara} />}
      {telaAtual === 'caixa' && <FrenteDeCaixa aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'configuracoes' && <Configuracoes aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'produtos' && <Produtos aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'notas' && <Notas aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'clientes' && <Clientes aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'relatorios' && <Relatorios aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'contas' && <ContasPagar aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'usuarios' && <Usuarios aoVoltar={() => irPara('dashboard')} />}
      {telaAtual === 'sincronizacao' && <Sincronizacao aoVoltar={() => irPara('dashboard')} />} 
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}