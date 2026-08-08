export interface Produto {
  id: string;
  codigoBarras: string;
  nome: string;
  categoria: string;
  preco: number;
}

export const categoriasMock = ['Head Shop', 'Destilados', 'Vinhos', 'Whisky', 'Terere Shop'];

export const produtosMock: Produto[] = [
  { id: '1', codigoBarras: '789123456001', nome: 'Carvão Zomo 1kg', categoria: 'Head Shop', preco: 45.00 },
  { id: '2', codigoBarras: '789123456002', nome: 'Whisky Red Label 1L', categoria: 'Whisky', preco: 119.90 },
  { id: '3', codigoBarras: '789123456003', nome: 'Vodka Absolut 1L', categoria: 'Destilados', preco: 95.00 },
  { id: '4', codigoBarras: '789123456004', nome: 'Erva Mate Kurupí Menta e Limão', categoria: 'Terere Shop', preco: 22.50 },
  { id: '5', codigoBarras: '789123456005', nome: 'Bomba de Inox Mola Ajustável', categoria: 'Terere Shop', preco: 35.00 },
  { id: '6', codigoBarras: '789123456006', nome: 'Vinho Casillero del Diablo', categoria: 'Vinhos', preco: 65.00 },
];