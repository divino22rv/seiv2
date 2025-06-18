import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { turmaAlunoService } from '../../services/turmaAlunoService';
import { TurmaAluno } from '../../types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';
import InactiveModal from '../common/InactiveModal';

const TurmaAlunoList: React.FC = () => {
  const [turmaAlunos, setTurmaAlunos] = useState<TurmaAluno[]>([]);
  const [filteredTurmaAlunos, setFilteredTurmaAlunos] = useState<TurmaAluno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInactiveModal, setShowInactiveModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchTurmaAlunos = async () => {
    try {
      setLoading(true);
      const data = await turmaAlunoService.getAtivos();
      setTurmaAlunos(data);
      setFilteredTurmaAlunos(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar vínculos turma-aluno');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurmaAlunos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = turmaAlunos.filter(
        turmaAluno =>
          turmaAluno.turma.toString().includes(searchTerm) ||
          turmaAluno.aluno.toString().includes(searchTerm)
      );
      setFilteredTurmaAlunos(filtered);
    } else {
      setFilteredTurmaAlunos(turmaAlunos);
    }
  }, [searchTerm, turmaAlunos]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await turmaAlunoService.delete(selectedId);
        setShowModal(false);
        fetchTurmaAlunos();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir vínculo');
      }
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      const turmaAluno = await turmaAlunoService.getById(id);
      await turmaAlunoService.update(id, { ...turmaAluno, ativo: true });
      fetchTurmaAlunos();
    } catch (err: any) {
      setError(err.message || 'Erro ao reativar vínculo');
    }
  };

  const renderInactiveRow = (turmaAluno: TurmaAluno) => (
    <>
      <td>{turmaAluno.id}</td>
      <td>{turmaAluno.turma}</td>
      <td>{turmaAluno.aluno}</td>
    </>
  );

  if (loading) {
    return <Loading message="Carregando vínculos turma-aluno..." />;
  }

  return (
    <>
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Turma - Alunos</h5>
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
            <Link to="/turma-alunos/novo">
              <Button variant="light" size="sm" className="d-flex align-items-center gap-1">
                <Plus size={18} />
                Novo Vínculo
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
              placeholder="Buscar por ID da turma ou aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {filteredTurmaAlunos.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">Nenhum vínculo encontrado.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID Turma</th>
                    <th>ID Aluno</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurmaAlunos.map((turmaAluno) => (
                    <tr key={turmaAluno.id}>
                      <td>{turmaAluno.id}</td>
                      <td>{turmaAluno.turma}</td>
                      <td>{turmaAluno.aluno}</td>
                      <td>
                        <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                          <CheckCircle size={14} /> Ativo
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/turma-alunos/${turmaAluno.id}`}>
                            <Button variant="info" size="sm" className="d-flex align-items-center">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/turma-alunos/editar/${turmaAluno.id}`}>
                            <Button variant="warning" size="sm" className="d-flex align-items-center">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => {
                              setSelectedId(turmaAluno.id!);
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
        message="Tem certeza que deseja excluir este vínculo?"
        confirmButtonLabel="Excluir"
        variant="danger"
      />

      <InactiveModal
        show={showInactiveModal}
        onHide={() => setShowInactiveModal(false)}
        title="Reativar Vínculos Turma-Aluno"
        fetchInactive={turmaAlunoService.getInativos}
        onReactivate={handleReactivate}
        renderRow={renderInactiveRow}
        columns={['#', 'ID Turma', 'ID Aluno']}
      />
    </>
  );
};

export default TurmaAlunoList;