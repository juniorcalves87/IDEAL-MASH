import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { analyzeWorkOrder } from '../services/ai';
import { WorkOrder } from '../types';
import { ArrowLeft, BrainCircuit, Clock, AlertCircle, CheckCircle2, Play, Pause, CheckSquare, Paperclip, MessageSquare } from 'lucide-react';

export const WorkOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [os, setOs] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'checklists' | 'attachments' | 'comments'>('details');
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchOS = async () => {
      if (!id) return;
      try {
        const data = await api.getWorkOrder(parseInt(id, 10));
        setOs(data);
      } catch (error) {
        console.error("Failed to fetch OS details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOS();
  }, [id]);

  const handleAnalyze = async () => {
    if (!os) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeWorkOrder(os);
      setAiAnalysis(result);
    } catch (error) {
      setAiAnalysis("Falha ao conectar com a IA. Verifique os logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!os) return <div className="p-8 text-center text-red-500">Ordem de Serviço não encontrada.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/work-orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
          <span>Voltar para lista</span>
        </Link>
        <div className="flex gap-3">
          {['open', 'scheduled'].includes(os.status) ? (
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Play size={18} /> Iniciar Execução
            </button>
          ) : os.status === 'in_progress' ? (
            <>
              <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Pause size={18} /> Pausar
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <CheckCircle2 size={18} /> Concluir
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">{os.code}</h1>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium uppercase">
                {os.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase ${
                os.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                os.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {os.priority}
              </span>
            </div>
            <h2 className="text-lg text-slate-700">{os.title}</h2>
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70"
          >
            <BrainCircuit size={20} className={isAnalyzing ? "animate-pulse" : ""} />
            {isAnalyzing ? 'Analisando com IA...' : 'Gerar Análise IA'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          {[
            { id: 'details', label: 'Detalhes', icon: AlertCircle },
            { id: 'checklists', label: 'Checklists', icon: CheckSquare },
            { id: 'attachments', label: 'Anexos', icon: Paperclip },
            { id: 'comments', label: 'Comentários', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Descrição do Serviço</h3>
                  <p className="text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {os.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1">Equipamento</span>
                    <span className="font-medium text-slate-800">EQP-{os.equipment_id}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1">Técnico</span>
                    <span className="font-medium text-slate-800">EMP-{os.employee_id}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Cronograma</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Clock size={18} className="text-slate-400" />
                      <div>
                        <span className="text-sm text-slate-500 block">Agendamento</span>
                        <span className="font-medium">{new Date(os.scheduledAt).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklists' && (
            <div className="text-center py-8 text-slate-500">
              <CheckSquare size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Nenhum checklist preenchido para esta OS.</p>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="text-center py-8 text-slate-500">
              <Paperclip size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Nenhum anexo enviado.</p>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Nenhum comentário registrado.</p>
            </div>
          )}
        </div>
      </div>

      {aiAnalysis && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
          <div className="bg-white/50 p-4 border-b border-indigo-100 flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900">Análise PCM Master AI</h3>
              <p className="text-sm text-indigo-700">Diagnóstico, 5 Porquês e Ishikawa gerados automaticamente.</p>
            </div>
          </div>
          <div className="p-6 prose prose-indigo max-w-none">
            {aiAnalysis.split('\n').map((line, i) => {
              if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-indigo-900">{line.replace('##', '')}</h3>;
              if (line.startsWith('#')) return <h2 key={i} className="text-xl font-bold mt-5 mb-3 text-indigo-900">{line.replace('#', '')}</h2>;
              if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block mt-3 text-slate-800">{line.replace(/\*\*/g, '')}</strong>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-700">{line.substring(2)}</li>;
              if (line.trim() === '') return <br key={i} />;
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={i} className="text-slate-700 mb-2">
                  {parts.map((part, j) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <strong key={j}>{part.slice(2, -2)}</strong> 
                      : part
                  )}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
