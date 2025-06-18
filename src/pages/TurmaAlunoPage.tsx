import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TurmaAlunoList from '../components/turmaAluno/TurmaAlunoList';
import TurmaAlunoForm from '../components/turmaAluno/TurmaAlunoForm';
import TurmaAlunoDetail from '../components/turmaAluno/TurmaAlunoDetail';

interface TurmaAlunoPageProps {
  action?: string;
}

const TurmaAlunoPage: React.FC<TurmaAlunoPageProps> = ({ action }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  if (action === 'novo' || location.pathname === '/turma-alunos/novo') {
    return <TurmaAlunoForm />;
  }

  if ((action === 'editar' || location.pathname.includes('/editar/')) && id) {
    return <TurmaAlunoForm />;
  }

  if (id && !action && !location.pathname.includes('/editar/')) {
    return <TurmaAlunoDetail />;
  }

  return <TurmaAlunoList />;
};

export default TurmaAlunoPage;