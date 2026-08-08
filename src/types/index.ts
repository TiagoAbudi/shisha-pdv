export interface Produto {
  id: string;
  codigoBarras: string;
  nome: string;
  categoria: string;
  preco: number;
}

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
}

export interface Cores {
  bgGeral: string;
  bgPainel: string;
  bgInput: string;
  texto: string;
  textoSecundario: string;
  borda: string;
  bordaForte: string;
  header: string;
  sombra: string;
}

export type Telas = 'login' | 'dashboard' | 'caixa' | 'produtos' | 'notas' | 'clientes' | 'configuracoes' | 'relatorios';