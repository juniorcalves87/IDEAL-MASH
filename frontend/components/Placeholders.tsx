import React from 'react';
import { Construction } from 'lucide-react';

export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 p-8">
    <Construction size={64} className="text-slate-300" />
    <h2 className="text-2xl font-bold text-slate-700">Módulo: {title}</h2>
    <p className="text-center max-w-md">
      Este módulo faz parte da arquitetura Field Control, mas a interface detalhada está em desenvolvimento. 
      A API REST correspondente já está mapeada no backend.
    </p>
  </div>
);
