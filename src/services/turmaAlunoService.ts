import api from './api';
import { TurmaAluno } from '../types';

export const turmaAlunoService = {
  getAll: async (): Promise<TurmaAluno[]> => {
    const response = await api.get('/turmaAluno');
    return response.data;
  },

  getById: async (id: number): Promise<TurmaAluno> => {
    const response = await api.get(`/turmaAluno/${id}`);
    return response.data;
  },

  getInativos: async (): Promise<TurmaAluno[]> => {
    const response = await api.get('/turmaAluno', { params: { ativo: false } });
    return response.data;
  },

  getAtivos: async (): Promise<TurmaAluno[]> => {
    const response = await api.get('/turmaAluno', { params: { ativo: true } });
    return response.data;
  },

  create: async (turmaAluno: TurmaAluno): Promise<TurmaAluno> => {
    const response = await api.post('/turmaAluno', turmaAluno);
    return response.data;
  },

  update: async (id: number, turmaAluno: TurmaAluno): Promise<TurmaAluno> => {
    const response = await api.put(`/turmaAluno/${id}`, turmaAluno);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/turmaAluno/${id}`);
  }
};
