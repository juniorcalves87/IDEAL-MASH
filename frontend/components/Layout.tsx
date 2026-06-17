import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wrench, Users, Package, Settings, Activity,
  Menu, Bell, Building2, MapPin, Navigation, Box, CheckSquare, 
  Paperclip, FileBarChart, BrainCircuit, Key, TerminalSquare
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navGroups = [
    {
      title: 'Visão Geral',
      items: [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      title: 'Gestão de Campo',
      items: [
        { path: '/customers', icon: Building2, label: 'Clientes' },
        { path: '/locations', icon: MapPin, label: 'Localizações' },
        { path: '/employees', icon: Users, label: 'Colaboradores' },
        { path: '/tracking', icon: Navigation, label: 'Rastreamento' },
      ]
    },
    {
      title: 'Manutenção (PCM)',
      items: [
        { path: '/equipment', icon: Activity, label: 'Equipamentos' },
        { path: '/work-orders', icon: Wrench, label: 'Ordens de Serviço' },
        { path: '/planning', icon: FileBarChart, label: 'Planejamento PCM' },
        { path: '/checklists', icon: CheckSquare, label: 'Checklists' },
      ]
    },
    {
      title: 'Suprimentos',
      items: [
        { path: '/materials', icon: Box, label: 'Materiais' },
        { path: '/products', icon: Package, label: 'Produtos e Serviços' },
        { path: '/stock', icon: Box, label: 'Estoque' },
      ]
    },
    {
      title: 'Inteligência & Dados',
      items: [
        { path: '/reports', icon: FileBarChart, label: 'Relatórios' },
        { path: '/indicators', icon: Activity, label: 'Indicadores' },
        { path: '/ai-pcm', icon: BrainCircuit, label: 'IA PCM' },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { path: '/settings', icon: Settings, label: 'Configurações' },
        { path: '/api-keys', icon: Key, label: 'API Keys' },
        { path: '/logs', icon: TerminalSquare, label: 'Logs de Integração' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col hidden md:flex overflow-y-auto custom-scrollbar">
        <div className="p-4 flex items-center gap-3 border-b border-slate-800 sticky top-0 bg-primary z-10">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            AI
          </div>
          <h1 className="font-bold text-lg tracking-tight">Field Manager</h1>
        </div>
        
        <nav className="flex-1 py-4">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                                   (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                          isActive 
                            ? 'bg-slate-800 text-accent border-r-4 border-accent font-medium' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'text-accent' : ''} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu size={24} />
            </button>
            <span className="font-bold text-primary">Field Manager AI</span>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Busca global (OS, Clientes, Equipamentos)..." 
                className="w-96 pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm">
                EM
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-slate-700 leading-tight">Eng. Master</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
};
