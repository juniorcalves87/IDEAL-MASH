import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Employee } from '../types';
import { Search, Plus, User, Map, Activity } from 'lucide-react';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.getEmployees();
        setEmployees(response.items);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar colaboradores..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            <Map size={18} /> Ver Mapa (Tracking)
          </button>
          <button className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={18} /> Novo Colaborador
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Colaborador</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Data de Cadastro</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando...</td></tr>
            ) : employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-slate-900">{emp.name}</span>
                </td>
                <td className="p-4 text-slate-600">{emp.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {emp.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-4 text-slate-600 text-sm">{new Date(emp.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-accent p-2"><Activity size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
