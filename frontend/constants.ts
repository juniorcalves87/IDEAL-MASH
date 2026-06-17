import { WorkOrder, Customer, Employee } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Indústria Alpha S.A.', documentNumber: '11.111.111/0001-11', contact: { email: 'contato@alpha.com', phone: '11999999999' }, address: { city: 'São Paulo', state: 'SP' }, archived: false, createdAt: '2023-01-15T10:00:00Z' },
  { id: 2, name: 'Beta Manufatura Ltda', documentNumber: '22.222.222/0001-22', contact: { email: 'manutencao@beta.com', phone: '21988888888' }, address: { city: 'Rio de Janeiro', state: 'RJ' }, archived: false, createdAt: '2023-03-20T14:30:00Z' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Carlos Silva', email: 'carlos.silva@pcm.com', isActive: true, createdAt: '2022-05-10T08:00:00Z' },
  { id: 2, name: 'Ana Souza', email: 'ana.souza@pcm.com', isActive: true, createdAt: '2022-06-15T09:00:00Z' },
  { id: 3, name: 'Roberto Alves', email: 'roberto.alves@pcm.com', isActive: false, createdAt: '2021-11-20T10:00:00Z' },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 1,
    code: 'OS-0001',
    title: 'Inspeção preventiva da ponte rolante',
    description: 'Verificar freios, cabos, fim de curso, botoeira e estrutura.',
    customer_id: 1,
    equipment_id: 101,
    employee_id: 1,
    status: 'scheduled',
    priority: 'high',
    scheduledAt: '2024-06-16T08:00:00Z',
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-06-10T10:00:00Z'
  },
  {
    id: 2,
    code: 'OS-0002',
    title: 'Troca de rolamento motor principal',
    description: 'Motor apresentando vibração excessiva e ruído anormal.',
    customer_id: 2,
    equipment_id: 102,
    employee_id: 2,
    status: 'in_progress',
    priority: 'critical',
    scheduledAt: '2024-06-15T08:00:00Z',
    createdAt: '2024-06-14T14:30:00Z',
    updatedAt: '2024-06-15T09:00:00Z'
  },
  {
    id: 3,
    code: 'OS-0003',
    title: 'Lubrificação esteira transportadora',
    description: 'Plano de lubrificação mensal.',
    customer_id: 1,
    equipment_id: 103,
    employee_id: 1,
    status: 'completed',
    priority: 'medium',
    scheduledAt: '2024-06-10T08:00:00Z',
    finishedAt: '2024-06-10T10:00:00Z',
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-06-10T10:00:00Z'
  },
  {
    id: 4,
    code: 'OS-0004',
    title: 'Calibração de sensores de pressão',
    description: 'Calibração anual obrigatória.',
    customer_id: 2,
    equipment_id: 104,
    employee_id: 2,
    status: 'open',
    priority: 'low',
    scheduledAt: '2024-06-20T08:00:00Z',
    createdAt: '2024-06-12T11:15:00Z',
    updatedAt: '2024-06-12T11:15:00Z'
  },
  {
    id: 5,
    code: 'OS-0005',
    title: 'Reparo vazamento linha de vapor',
    description: 'Vazamento identificado na válvula principal do setor B.',
    customer_id: 1,
    equipment_id: 105,
    employee_id: 1,
    status: 'open',
    priority: 'critical',
    scheduledAt: '2024-06-13T08:00:00Z', // Overdue
    createdAt: '2024-06-13T07:00:00Z',
    updatedAt: '2024-06-13T07:00:00Z'
  }
];

export const AI_SYSTEM_PROMPT = `Você é o PCM Master Engineer AI, especialista em Planejamento e Controle de Manutenção, SGI, qualidade, segurança, confiabilidade industrial e gestão de ordens de serviço.

Analise os dados da ordem de serviço, equipamento, histórico de falhas, prioridade, prazo, risco e criticidade.

Retorne a resposta formatada em Markdown com os seguintes tópicos obrigatórios:
1. **Resumo Executivo para Liderança**
2. **Classificação de Prioridade e Risco Operacional**
3. **Sugestão de Técnico Ideal e Mão de Obra**
4. **Sugestão de Materiais Necessários**
5. **Plano de Ação Detalhado**
6. **Identificação de Reincidência e Risco de Atraso**
7. **Checklist Automático de Segurança e Execução**
8. **Análise de Causa Raiz (Aplicando 5 Porquês e Diagrama de Ishikawa)**
9. **Indicadores Afetados (MTTR, MTBF, Disponibilidade)**
10. **Sugestão de Melhoria Contínua**

Use linguagem técnica, objetiva e aplicável ao chão de fábrica.`;
