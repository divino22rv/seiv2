import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, User, Mail, CreditCard, Calendar } from 'lucide-react';
import { alunoService } from '../../services/alunoService';
import { Aluno } from '../../types';
import Loading from '../common/Loading';

const AlunoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        if (id) {
          const data = await alunoService.getById(parseInt(id));
          setAluno(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar aluno');
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando dados do aluno..." />;
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">{error}</div>
          <Link to="/alunos">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (!aluno) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-warning">Aluno não encontrado</div>
          <Link to="/alunos">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Detalhes do Aluno</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={8}>
            <h3 className="d-flex align-items-center gap-2">
              <User size={24} />
              {aluno.nome}
            </h3>
            {aluno.ativo ? (
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
                  <Mail size={20} />
                  Email
                </h5>
                <p className="fs-5">{aluno.email}</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <CreditCard size={20} />
                  Matrícula
                </h5>
                <p className="fs-5">{aluno.matricula}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <Calendar size={20} />
                  Data de Nascimento
                </h5>
                <p className="fs-5">{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Link to="/alunos">
            <Button variant="secondary" className="d-flex align-items-center gap-1">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <Link to={`/alunos/editar/${aluno.id}`}>
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

export default AlunoDetail;