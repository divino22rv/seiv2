import api from './api';
import { Disciplina } from '../types';

export const disciplinaService = {
  getAll: async (): Promise<Disciplina[]> => {
    const response = await api.get('/disciplina');
    return response.data;
  },

  getById: async (id: number): Promise<Disciplina> => {
    const response = await api.get(`/disciplina/${id}`);
    return response.data;
  },

  getByNome: async (nome: string): Promise<Disciplina[]> => {
    const response = await api.get(`/disciplina/nome/${nome}`);
    return response.data;
  },

  create: async (disciplina: Disciplina): Promise<Disciplina> => {
    const response = await api.post('/disciplina', disciplina);
    return response.data;
  },

  update: async (id: number, disciplina: Disciplina): Promise<Disciplina> => {
    const response = await api.put(`/disciplina/${id}`, disciplina);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/disciplina/${id}`);
  },

  getInativos: async (): Promise<Disciplina[]> => {
    const response = await api.get('/disciplina', { params: { ativo: false } });
    return response.data;
  },

  getAtivos: async (): Promise<Disciplina[]> => {
    const response = await api.get('/disciplina', { params: { ativo: true } });
    return response.data;
  }
};