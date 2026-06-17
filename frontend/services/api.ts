import { WorkOrder, DashboardKPIs, PaginatedResponse, Status, Customer, Employee } from '../types';
import { MOCK_WORK_ORDERS, MOCK_CUSTOMERS, MOCK_EMPLOYEES } from '../constants';

// Simulating a database in memory for the frontend demo
let workOrdersDb = [...MOCK_WORK_ORDERS];
let customersDb = [...MOCK_CUSTOMERS];
let employeesDb = [...MOCK_EMPLOYEES];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate API Key validation
const validateApiKey = () => {
  const apiKey = localStorage.getItem('X-Api-Key') || 'mock-key';
  if (!apiKey) throw new Error('401 - API Key inválida');
};

export const api = {
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    validateApiKey();
    await delay(500);
    const now = new Date();
    
    const totalOs = workOrdersDb.length;
    const osConcluidas = workOrdersDb.filter(os => os.status === 'completed').length;
    const osAbertas = workOrdersDb.filter(os => os.status !== 'completed' && os.status !== 'canceled').length;
    const osCriticas = workOrdersDb.filter(os => os.priority === 'critical' && os.status !== 'completed').length;
    const osVencidas = workOrdersDb.filter(os => {
      if (os.status === 'completed' || os.status === 'canceled') return false;
      return new Date(os.scheduledAt) < now;
    }).length;

    return { 
      totalCustomers: customersDb.length,
      totalEmployees: employeesDb.filter(e => e.isActive).length,
      totalOs, 
      osAbertas, 
      osVencidas, 
      osCriticas,
      osConcluidas,
      mttr: 4.5, // Mocked calculated value
      mtbf: 320, // Mocked calculated value
      disponibilidade: 98.5 // Mocked calculated value
    };
  },

  async getWorkOrders(limit = 10, offset = 0): Promise<PaginatedResponse<WorkOrder>> {
    validateApiKey();
    await delay(600);
    const items = workOrdersDb.slice(offset, offset + limit);
    return { items, totalCount: workOrdersDb.length, limit, offset };
  },

  async getWorkOrder(id: number): Promise<WorkOrder | null> {
    validateApiKey();
    await delay(300);
    return workOrdersDb.find(os => os.id === id) || null;
  },

  async updateWorkOrderStatus(id: number, status: Status): Promise<WorkOrder> {
    validateApiKey();
    await delay(400);
    const index = workOrdersDb.findIndex(os => os.id === id);
    if (index === -1) throw new Error('OS not found');
    
    workOrdersDb[index] = { ...workOrdersDb[index], status, updatedAt: new Date().toISOString() };
    return workOrdersDb[index];
  },

  async getCustomers(limit = 10, offset = 0): Promise<PaginatedResponse<Customer>> {
    validateApiKey();
    await delay(400);
    const items = customersDb.slice(offset, offset + limit);
    return { items, totalCount: customersDb.length, limit, offset };
  },

  async getEmployees(limit = 10, offset = 0): Promise<PaginatedResponse<Employee>> {
    validateApiKey();
    await delay(400);
    const items = employeesDb.slice(offset, offset + limit);
    return { items, totalCount: employeesDb.length, limit, offset };
  }
};
