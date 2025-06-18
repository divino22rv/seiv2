import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { professorService } from '../../services/professorService';
import { Professor } from '../../types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';

const ProfessorList: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchProfessores = async () => {
    try {
      setLoading(true);
      const data = await professorService.getAll();
      setProfessores(data);
      setFilteredProfessores(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = professores.filter(
        professor =>
          professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          professor.matricula.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfessores(filtered);
    } else {
      setFilteredProfessores(professores);
    }
  }, [searchTerm, professores]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await professorService.delete(selectedId);
        setShowModal(false);
        fetchProfessores();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir professor');
      }
    }
  };

  if (loading) {
    return <Loading message="Carregando professores..." />;
  }

  return (
    <>
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Professores</h5>
          <Link to="/professores/novo">
            <Button variant="light" size="sm" className="d-flex align-items-center gap-1">
              <Plus size={18} />
              Novo Professor
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar professor por nome ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {filteredProfessores.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">Nenhum professor encontrado.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Matrícula</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfessores.map((professor) => (
                    <tr key={professor.id}>
                      <td>{professor.id}</td>
                      <td>{professor.nome}</td>
                      <td>{professor.matricula}</td>
                      <td>
                        {professor.ativo ? (
                          <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                            <CheckCircle size={14} /> Ativo
                          </Badge>
                        ) : (
                          <Badge bg="danger" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                            <XCircle size={14} /> Inativo
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/professores/${professor.id}`}>
                            <Button variant="info" size="sm" className="d-flex align-items-center">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/professores/editar/${professor.id}`}>
                            <Button variant="warning" size="sm" className="d-flex align-items-center">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => {
                              setSelectedId(professor.id!);
                              setShowModal(true);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este professor?"
        confirmButtonLabel="Excluir"
        variant="danger"
      />
    </>
  );
};

export default ProfessorList;