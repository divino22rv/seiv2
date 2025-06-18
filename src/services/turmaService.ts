import api from './api';
import { Turma } from '../types';

export const turmaService = {
  getAll: async (): Promise<Turma[]> => {
    const response = await api.get('/turmas');
    return response.data;
  },

  getAllWithRelations: async (): Promise<Turma[]> => {
    const response = await api.get('/turmas/relations');
    return response.data;
  },

  getById: async (id: number): Promise<Turma> => {
    const response = await api.get(`/turmas/${id}`);
    return response.data;
  },

  create: async (turma: Turma): Promise<Turma> => {
    const response = await api.post('/turmas', turma);
    return response.data;
  },

  update: async (id: number, turma: Turma): Promise<Turma> => {
    const response = await api.put(`/turmas/${id}`, turma);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/turmas/${id}`);
  },

  getInativos: async (): Promise<Turma[]> => {
    const response = await api.get('/turma', { params: { ativo: false } });
    return response.data;
  },

  getAtivos: async (): Promise<Turma[]> => {
    const response = await api.get('/turmas', { params: { ativo: true } });
    return response.data;
  }

  
};