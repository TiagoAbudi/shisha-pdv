import { create } from 'zustand';

interface CaixaState {
  statusCaixa: 'fechado' | 'aberto';
  fundoRegistrado: number;
  abrirCaixa: (valor: number) => void;
  fecharCaixa: () => void;
}

export const useCaixaStore = create<CaixaState>((set) => ({
  statusCaixa: 'fechado',
  fundoRegistrado: 0,
  abrirCaixa: (valor) => set({ statusCaixa: 'aberto', fundoRegistrado: valor }),
  fecharCaixa: () => set({ statusCaixa: 'fechado', fundoRegistrado: 0 }),
}));