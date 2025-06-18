import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, BookOpen, User, Clock, Home } from 'lucide-react';
import { turmaService } from '../../services/turmaService';
import { Turma } from '../../types';
import Loading from '../common/Loading';

const TurmaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [turma, setTurma] = useState<Turma | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurma = async () => {
      try {
        if (id) {
          const data = await turmaService.getById(parseInt(id));
          setTurma(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar turma');
      } finally {
        setLoading(false);
      }
    };

    fetchTurma();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando dados da turma..." />;
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">{error}</div>
          <Link to="/turmas">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (!turma) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-warning">Turma não encontrada</div>
          <Link to="/turmas">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Detalhes da Turma</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col>
            <h3 className="d-flex align-items-center gap-2">
              Turma {turma.codigoTurma}
            </h3>
            {turma.ativo ? (
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
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <BookOpen size={20} />
                  Disciplina
                </h5>
                <p className="fs-4">
                  {turma.disciplina?.nome || 'N/A'}
                  {turma.disciplina?.carga_horaria && 
                    <span className="fs-6 text-muted ms-2">
                      ({turma.disciplina.carga_horaria}h)
                    </span>
                  }
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <User size={20} />
                  Professor
                </h5>
                <p className="fs-4">
                  {turma.professor?.nome || 'N/A'}
                  {turma.professor?.matricula && 
                    <span className="fs-6 text-muted ms-2">
                      ({turma.professor.matricula})
                    </span>
                  }
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <Home size={20} />
                  Sala
                </h5>
                <p className="fs-4">
                  {turma.sala ? `Sala ${turma.sala.numero}` : 'N/A'}
                  {turma.sala?.capacidade && 
                    <span className="fs-6 text-muted ms-2">
                      (Capacidade: {turma.sala.capacidade})
                    </span>
                  }
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <Clock size={20} />
                  Horário
                </h5>
                <p className="fs-4">{turma.horario}h</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Link to="/turmas">
            <Button variant="secondary" className="d-flex align-items-center gap-1">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <Link to={`/turmas/editar/${turma.id}`}>
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

export default TurmaDetail;