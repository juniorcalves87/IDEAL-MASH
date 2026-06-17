export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'canceled';

export interface Customer {
  id: number;
  name: string;
  documentNumber: string;
  contact: {
    email: string;
    phone: string;
  };
  address: {
    city: string;
    state: string;
  };
  archived: boolean;
  createdAt: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface Material {
  id: number;
  name: string;
  measure: string;
  archived: boolean;
}

export interface WorkOrder {
  id: number;
  code: string;
  title: string;
  description: string;
  customer_id?: number;
  equipment_id: number;
  employee_id: number;
  status: Status;
  priority: Priority;
  scheduledAt: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: number;
  question: string;
  answer?: string;
  required: boolean;
  nonConformity: boolean;
}

export interface Comment {
  id: number;
  comment: string;
  user_id: number;
  createdAt: string;
}

export interface DashboardKPIs {
  totalCustomers: number;
  totalEmployees: number;
  totalOs: number;
  osAbertas: number;
  osVencidas: number;
  osCriticas: number;
  osConcluidas: number;
  mttr: number; // Mean Time To Repair (hours)
  mtbf: number; // Mean Time Between Failures (hours)
  disponibilidade: number; // Percentage
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
}
