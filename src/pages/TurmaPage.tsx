import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TurmaList from '../components/turma/TurmaList';
import TurmaForm from '../components/turma/TurmaForm';
import TurmaDetail from '../components/turma/TurmaDetail';

interface TurmaPageProps {
  action?: string;
}

const TurmaPage: React.FC<TurmaPageProps> = ({ action }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // New page
  if (action === 'novo' || location.pathname === '/turmas/novo') {
    return <TurmaForm />;
  }

  // Edit page
  if ((action === 'editar' || location.pathname.includes('/editar/')) && id) {
    return <TurmaForm />;
  }

  // View/Details page
  if (id && !action && !location.pathname.includes('/editar/')) {
    return <TurmaDetail />;
  }

  // List page (default)
  return <TurmaList />;
};

export default TurmaPage;