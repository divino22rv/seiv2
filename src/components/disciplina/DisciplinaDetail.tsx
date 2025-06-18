import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { disciplinaService } from '../../services/disciplinaService';
import { Disciplina } from '../../types';
import Loading from '../common/Loading';

const DisciplinaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplina = async () => {
      try {
        if (id) {
          const data = await disciplinaService.getById(parseInt(id));
          setDisciplina(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar disciplina');
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplina();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando dados da disciplina..." />;
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">{error}</div>
          <Link to="/disciplinas">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (!disciplina) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-warning">Disciplina não encontrada</div>
          <Link to="/disciplinas">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Detalhes da Disciplina</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={8}>
            <h3 className="d-flex align-items-center gap-2">
              <BookOpen size={24} />
              {disciplina.nome}
            </h3>
            {disciplina.ativo ? (
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
                  <Clock size={20} />
                  Carga Horária
                </h5>
                <p className="fs-4">{disciplina.carga_horaria} horas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Link to="/disciplinas">
            <Button variant="secondary" className="d-flex align-items-center gap-1">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <Link to={`/disciplinas/editar/${disciplina.id}`}>
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

export default DisciplinaDetail;