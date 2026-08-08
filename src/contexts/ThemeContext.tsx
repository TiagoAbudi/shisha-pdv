import React, { createContext, useContext, useState } from 'react';
import { Cores } from '../types';

interface ThemeContextData {
  temaEscuro: boolean;
  toggleTema: () => void;
  cores: Cores;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [temaEscuro, setTemaEscuro] = useState(true);

  const toggleTema = () => setTemaEscuro(!temaEscuro);

  const cores: Cores = temaEscuro ? {
    bgGeral: '#09090b', bgPainel: '#18181b', bgInput: '#27272a',
    texto: '#f8fafc', textoSecundario: '#a1a1aa', borda: '#27272a',
    bordaForte: '#3f3f46', header: '#000000',
    sombra: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
  } : {
    bgGeral: '#f8fafc', bgPainel: '#ffffff', bgInput: '#f1f5f9',
    texto: '#0f172a', textoSecundario: '#64748b', borda: '#e2e8f0',
    bordaForte: '#cbd5e1', header: '#ffffff',
    sombra: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
  };

  return (
    <ThemeContext.Provider value={{ temaEscuro, toggleTema, cores }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);