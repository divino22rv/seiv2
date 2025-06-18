import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { alunoService } from '../../services/alunoService';
import { Aluno } from '../../types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';
import InactiveModal from '../common/InactiveModal';

const AlunoList: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInactiveModal, setShowInactiveModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const data = await alunoService.getAtivos();
      setAlunos(data);
      setFilteredAlunos(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = alunos.filter(
        aluno =>
          aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlunos(filtered);
    } else {
      setFilteredAlunos(alunos);
    }
  }, [searchTerm, alunos]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await alunoService.delete(selectedId);
        setShowModal(false);
        fetchAlunos();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir aluno');
      }
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      const aluno = await alunoService.getById(id);
      await alunoService.update(id, { ...aluno, ativo: true });
      fetchAlunos();
    } catch (err: any) {
      setError(err.message || 'Erro ao reativar aluno');
    }
  };

  const renderInactiveRow = (aluno: Aluno) => (
    <>
      <td>{aluno.id}</td>
      <td>{aluno.nome}</td>
      <td>{aluno.email}</td>
      <td>{aluno.matricula}</td>
      <td>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</td>
    </>
  );

  if (loading) {
    return <Loading message="Carregando alunos..." />;
  }

  return (
    <>
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Alunos</h5>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-light" 
              size="sm" 
              className="d-flex align-items-center gap-1"
              onClick={() => setShowInactiveModal(true)}
            >
              <RotateCcw size={18} />
              Reativar
            </Button>
            <Link to="/alunos/novo">
              <Button variant="light" size="sm" className="d-flex align-items-center gap-1">
                <Plus size={18} />
                Novo Aluno
              </Button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar aluno por nome, email ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {filteredAlunos.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">Nenhum aluno encontrado.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Matrícula</th>
                    <th>Data Nascimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlunos.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.matricula}</td>
                      <td>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                          <CheckCircle size={14} /> Ativo
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/alunos/${aluno.id}`}>
                            <Button variant="info" size="sm" className="d-flex align-items-center">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/alunos/editar/${aluno.id}`}>
                            <Button variant="warning" size="sm" className="d-flex align-items-center">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => {
                              setSelectedId(aluno.id!);
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
        message="Tem certeza que deseja excluir este aluno?"
        confirmButtonLabel="Excluir"
        variant="danger"
      />

      <InactiveModal
        show={showInactiveModal}
        onHide={() => setShowInactiveModal(false)}
        title="Reativar Alunos"
        fetchInactive={alunoService.getInativos}
        onReactivate={handleReactivate}
        renderRow={renderInactiveRow}
        columns={['#', 'Nome', 'Email', 'Matrícula', 'Data Nascimento']}
      />
    </>
  );
};

export default AlunoList;