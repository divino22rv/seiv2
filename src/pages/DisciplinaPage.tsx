import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DisciplinaList from '../components/disciplina/DisciplinaList';
import DisciplinaForm from '../components/disciplina/DisciplinaForm';
import DisciplinaDetail from '../components/disciplina/DisciplinaDetail';

interface DisciplinaPageProps {
  action?: string;
}

const DisciplinaPage: React.FC<DisciplinaPageProps> = ({ action }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  if (action === 'novo' || location.pathname === '/disciplinas/novo') {
    return <DisciplinaForm />;
  }

  if ((action === 'editar' || location.pathname.includes('/editar/')) && id) {
    return <DisciplinaForm />;
  }

  if (id && !action && !location.pathname.includes('/editar/')) {
    return <DisciplinaDetail />;
  }

  return <DisciplinaList />;
};

export default DisciplinaPage;