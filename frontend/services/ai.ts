import { GoogleGenAI } from '@google/genai';
import { WorkOrder } from '../types';
import { AI_SYSTEM_PROMPT } from '../constants';

export const analyzeWorkOrder = async (os: WorkOrder): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

    const prompt = `
      Por favor, analise a seguinte Ordem de Serviço com base nas suas instruções de sistema.
      
      DADOS DA ORDEM DE SERVIÇO:
      - Código: ${os.code}
      - Título: ${os.title}
      - Descrição: ${os.description}
      - Prioridade Atual: ${os.priority}
      - Status Atual: ${os.status}
      - Agendamento: ${os.scheduledAt}
      - Equipamento ID: ${os.equipment_id}
      - Cliente ID: ${os.customer_id || 'N/A'}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_PROMPT,
        temperature: 0.2,
      }
    });

    return response.text || 'Nenhuma análise gerada.';
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `Erro ao gerar análise da IA. Verifique a configuração da API Key.\n\nDetalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
  }
};
