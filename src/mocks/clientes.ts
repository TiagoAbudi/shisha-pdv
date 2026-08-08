export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
}

export const clientesMock: Cliente[] = [
  { id: '1', nome: 'Tiago Abudi', cpf: '111.222.333-44' },
  { id: '2', nome: 'João Silva', cpf: '555.666.777-88' },
  { id: '3', nome: 'Maria Oliveira (Fiado)', cpf: '999.888.777-66' },
];