import api from './api';
import { Aluno } from '../types';

export const alunoService = {
  getAll: async (): Promise<Aluno[]> => {
    const response = await api.get('/aluno');
    return response.data;
  },

  getById: async (id: number): Promise<Aluno> => {
    const response = await api.get(`/aluno/${id}`);
    return response.data;
  },

  getByMatricula: async (matricula: string): Promise<Aluno[]> => {
    const response = await api.get(`/aluno/matricula/${matricula}`);
    return response.data;
  },

  getInativos: async (): Promise<Aluno[]> => {
    const response = await api.get('/aluno', { params: { ativo: false } });
    return response.data;
  },

  getAtivos: async (): Promise<Aluno[]> => {
    const response = await api.get('/aluno', { params: { ativo: true } });
    return response.data;
  },

  create: async (aluno: Aluno): Promise<Aluno> => {
    const response = await api.post('/aluno', aluno);
    return response.data;
  },

  update: async (id: number, aluno: Aluno): Promise<Aluno> => {
    const response = await api.put(`/aluno/${id}`, aluno);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/aluno/${id}`);
  }
};
