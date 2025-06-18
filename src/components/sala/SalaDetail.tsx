import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, Home, Users } from 'lucide-react';
import { salaService } from '../../services/salaService';
import { Sala } from '../../types';
import Loading from '../common/Loading';

const SalaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSala = async () => {
      try {
        if (id) {
          const data = await salaService.getById(parseInt(id));
          setSala(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar sala');
      } finally {
        setLoading(false);
      }
    };

    fetchSala();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando dados da sala..." />;
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">{error}</div>
          <Link to="/salas">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (!sala) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-warning">Sala não encontrada</div>
          <Link to="/salas">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Detalhes da Sala</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={8}>
            <h3 className="d-flex align-items-center gap-2">
              <Home size={24} />
              Sala {sala.numero}
            </h3>
            {sala.ativo ? (
              <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <CheckCircle size={14} /> Ativo
              </Badge>
            ) : (
              <Badge bg="danger" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <XCircle size={14} /> Inativo
              </Badge>
            )}
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <Users size={20} />
                  Capacidade
                </h5>
                <p className="fs-4">{sala.capacidade} lugares</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Link to="/salas">
            <Button variant="secondary" className="d-flex align-items-center gap-1">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <Link to={`/salas/editar/${sala.id}`}>
            <Button variant="primary" className="d-flex align-items-center gap-1">
              <Edit size={18} />
              Editar
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalaDetail;