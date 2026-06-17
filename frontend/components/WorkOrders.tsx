import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { WorkOrder } from '../types';
import { Search, Filter, Plus, Eye } from 'lucide-react';

export const WorkOrders: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getWorkOrders();
        setOrders(response.items);
      } catch (error) {
        console.error("Failed to fetch work orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-amber-100 text-amber-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'canceled': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      open: 'Aberta', scheduled: 'Agendada', in_progress: 'Em Execução',
      paused: 'Pausada', completed: 'Concluída', canceled: 'Cancelada'
    };
    return map[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border border-blue-200';
      case 'low': return 'text-slate-600 bg-slate-50 border border-slate-200';
      default: return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = { critical: 'Crítica', high: 'Alta', medium: 'Média', low: 'Baixa' };
    return map[priority] || priority;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar OS..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Nova OS
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Código</th>
                <th className="p-4 font-medium">Título</th>
                <th className="p-4 font-medium">Prioridade</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Agendamento</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Carregando...</td></tr>
              ) : orders.map((os) => (
                <tr key={os.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{os.code}</td>
                  <td className="p-4 text-slate-700 max-w-xs truncate" title={os.title}>{os.title}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(os.priority)}`}>
                      {getPriorityLabel(os.priority)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(os.status)}`}>
                      {getStatusLabel(os.status)}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">
                    {new Date(os.scheduledAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      to={`/work-orders/${os.id}`}
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-accent hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
