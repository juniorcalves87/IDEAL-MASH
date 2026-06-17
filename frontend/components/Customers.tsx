import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Customer } from '../types';
import { Search, Plus, Building2, MapPin, Phone, Mail } from 'lucide-react';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.getCustomers();
        setCustomers(response.items);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar clientes por nome ou documento..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center p-8 text-slate-500">Carregando clientes...</div>
        ) : customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{customer.name}</h3>
                  <p className="text-xs text-slate-500">Doc: {customer.documentNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                <span>{customer.address.city}, {customer.address.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span>{customer.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <span>{customer.contact.email}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button className="text-sm text-accent hover:text-blue-700 font-medium">Ver Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
