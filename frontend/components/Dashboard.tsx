import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardKPIs } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, FileText, Users, Building2, Activity, Zap } from 'lucide-react';

const mockChartData = [
  { name: 'Seg', concluidas: 4, abertas: 2 },
  { name: 'Ter', concluidas: 3, abertas: 4 },
  { name: 'Qua', concluidas: 5, abertas: 1 },
  { name: 'Qui', concluidas: 2, abertas: 5 },
  { name: 'Sex', concluidas: 6, abertas: 2 },
  { name: 'Sáb', concluidas: 1, abertas: 0 },
  { name: 'Dom', concluidas: 0, abertas: 0 },
];

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await api.getDashboardKPIs();
        setKpis(data);
      } catch (error) {
        console.error("Failed to fetch KPIs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Carregando dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
        <div className="text-sm text-slate-500">Última atualização: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Clientes Ativos" value={kpis?.totalCustomers || 0} icon={Building2} color="bg-indigo-500" />
        <KpiCard title="Colaboradores" value={kpis?.totalEmployees || 0} icon={Users} color="bg-blue-500" />
        <KpiCard title="OS Críticas" value={kpis?.osCriticas || 0} icon={AlertTriangle} color="bg-red-500" />
        <KpiCard title="OS Concluídas" value={kpis?.osConcluidas || 0} icon={CheckCircle} color="bg-emerald-500" />
      </div>

      {/* Engineering KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">MTTR (Tempo Médio Reparo)</p>
            <h4 className="text-2xl font-bold text-slate-800">{kpis?.mttr} <span className="text-sm font-normal text-slate-500">horas</span></h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><Clock size={20} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">MTBF (Tempo Entre Falhas)</p>
            <h4 className="text-2xl font-bold text-slate-800">{kpis?.mtbf} <span className="text-sm font-normal text-slate-500">horas</span></h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Activity size={20} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Disponibilidade Física</p>
            <h4 className="text-2xl font-bold text-slate-800">{kpis?.disponibilidade}%</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><Zap size={20} /></div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Produtividade Semanal (OS)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="concluidas" name="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="abertas" name="Abertas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Evolução da Disponibilidade</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="concluidas" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
  </div>
);
