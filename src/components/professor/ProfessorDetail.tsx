import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, User, CreditCard } from 'lucide-react';
import { professorService } from '../../services/professorService';
import { Professor } from '../../types';
import Loading from '../common/Loading';

const ProfessorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        if (id) {
          const data = await professorService.getById(parseInt(id));
          setProfessor(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar professor');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando dados do professor..." />;
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">{error}</div>
          <Link to="/professores">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (!professor) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-warning">Professor não encontrado</div>
          <Link to="/professores">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Detalhes do Professor</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={8}>
            <h3 className="d-flex align-items-center gap-2">
              <User size={24} />
              {professor.nome}
            </h3>
            {professor.ativo ? (
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
                  <CreditCard size={20} />
                  Matrícula
                </h5>
                <p className="fs-4">{professor.matricula}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Link to="/professores">
            <Button variant="secondary" className="d-flex align-items-center gap-1">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <Link to={`/professores/editar/${professor.id}`}>
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

export default ProfessorDetail;