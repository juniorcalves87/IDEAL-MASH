import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WorkOrders } from './components/WorkOrders';
import { WorkOrderDetail } from './components/WorkOrderDetail';
import { Customers } from './components/Customers';
import { Employees } from './components/Employees';
import { PlaceholderPage } from './components/Placeholders';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
          
          {/* Placeholders for other requested routes */}
          <Route path="/locations" element={<PlaceholderPage title="Localizações" />} />
          <Route path="/tracking" element={<PlaceholderPage title="Rastreamento" />} />
          <Route path="/equipment" element={<PlaceholderPage title="Equipamentos" />} />
          <Route path="/planning" element={<PlaceholderPage title="Planejamento PCM" />} />
          <Route path="/checklists" element={<PlaceholderPage title="Checklists" />} />
          <Route path="/materials" element={<PlaceholderPage title="Materiais" />} />
          <Route path="/products" element={<PlaceholderPage title="Produtos e Serviços" />} />
          <Route path="/stock" element={<PlaceholderPage title="Estoque" />} />
          <Route path="/reports" element={<PlaceholderPage title="Relatórios" />} />
          <Route path="/indicators" element={<PlaceholderPage title="Indicadores" />} />
          <Route path="/ai-pcm" element={<PlaceholderPage title="IA PCM" />} />
          <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
          <Route path="/api-keys" element={<PlaceholderPage title="API Keys" />} />
          <Route path="/logs" element={<PlaceholderPage title="Logs de Integração" />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
