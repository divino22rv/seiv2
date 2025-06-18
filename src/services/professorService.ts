import api from './api';
import { Professor } from '../types';

export const professorService = {
  getAll: async (): Promise<Professor[]> => {
    const response = await api.get('/professor');
    return response.data;
  },

  getById: async (id: number): Promise<Professor> => {
    const response = await api.get(`/professor/${id}`);
    return response.data;
  },

  getByMatricula: async (matricula: string): Promise<Professor[]> => {
    const response = await api.get(`/professor/matricula/${matricula}`);
    return response.data;
  },

  create: async (professor: Professor): Promise<Professor> => {
    const response = await api.post('/professor', professor);
    return response.data;
  },

  update: async (id: number, professor: Professor): Promise<Professor> => {
    const response = await api.put(`/professor/${id}`, professor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/professor/${id}`);
  },

  getInativos: async (): Promise<Professor[]> => {
    const response = await api.get('/professor', { params: { ativo: false } });
    return response.data;
  },

  getAtivos: async (): Promise<Professor[]> => {
    const response = await api.get('/professor', { params: { ativo: true } });
    return response.data;
  }
};