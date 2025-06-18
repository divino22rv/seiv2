export interface Disciplina {
  id?: number;
  nome: string;
  carga_horaria: number;
  ativo: boolean;
  turmas?: Turma[];
}

export interface Professor {
  id?: number;
  nome: string;
  matricula: string;
  ativo: boolean;
  turmas?: Turma[];
}

export interface Sala {
  id?: number;
  numero: number;
  capacidade: number;
  ativo: boolean;
  turmas?: Turma[];
}

export interface Turma {
  id?: number;
  codigoTurma: string;
  disciplina_id: number;
  disciplina?: Disciplina;
  professor_id: number;
  professor?: Professor;
  sala_id: number;
  sala?: Sala;
  horario: number;
  ativo: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  matricula: string;
  dataNascimento: string;
  ativo: boolean;
}

export interface TurmaAluno {
  id?: number;
  turma: number;
  aluno: number;
  ativo: boolean;
}