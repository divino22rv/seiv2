import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AlunoList from '../components/aluno/AlunoList';
import AlunoForm from '../components/aluno/AlunoForm';
import AlunoDetail from '../components/aluno/AlunoDetail';

interface AlunoPageProps {
  action?: string;
}

const AlunoPage: React.FC<AlunoPageProps> = ({ action }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  if (action === 'novo' || location.pathname === '/alunos/novo') {
    return <AlunoForm />;
  }

  if ((action === 'editar' || location.pathname.includes('/editar/')) && id) {
    return <AlunoForm />;
  }

  if (id && !action && !location.pathname.includes('/editar/')) {
    return <AlunoDetail />;
  }

  return <AlunoList />;
};

export default AlunoPage;