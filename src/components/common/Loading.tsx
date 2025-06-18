import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-5">
      <Spinner animation="border" role="status" variant="primary" />
      <span className="mt-2">{message}</span>
    </div>
  );
};

export default Loading;