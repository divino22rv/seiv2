import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Save, ArrowLeft } from 'lucide-react';
import { turmaAlunoService } from '../../services/turmaAlunoService';
import { turmaService } from '../../services/turmaService';
import { alunoService } from '../../services/alunoService';
import { TurmaAluno, Turma, Aluno } from '../../types';
import Loading from '../common/Loading';

const validationSchema = Yup.object().shape({
  turma: Yup.number()
    .required('Turma é obrigatória')
    .positive('Selecione uma turma válida'),
  aluno: Yup.number()
    .required('Aluno é obrigatório')
    .positive('Selecione um aluno válido'),
  ativo: Yup.boolean().required('Status é obrigatório')
});

const TurmaAlunoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [initialValues, setInitialValues] = useState<TurmaAluno>({
    turma: 0,
    aluno: 0,
    ativo: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [turmasData, alunosData] = await Promise.all([
          turmaService.getAtivos(),
          alunoService.getAtivos()
        ]);
        
        setTurmas(turmasData);
        setAlunos(alunosData);
        
        if (id) {
          const turmaAlunoData = await turmaAlunoService.getById(parseInt(id));
          setInitialValues(turmaAlunoData);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values: TurmaAluno) => {
    try {
      setLoading(true);
      if (id) {
        await turmaAlunoService.update(parseInt(id), values);
      } else {
        await turmaAlunoService.create(values);
      }
      navigate('/turma-alunos');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar vínculo');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados..." />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-primary text-white">
        {id ? 'Editar Vínculo Turma-Aluno' : 'Novo Vínculo Turma-Aluno'}
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {(!turmas.length || !alunos.length) && (
          <Alert variant="warning">
            Para criar um vínculo, é necessário ter turmas e alunos cadastrados.
          </Alert>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Turma</Form.Label>
                <Form.Select
                  name="turma"
                  value={values.turma}
                  onChange={handleChange}
                  isInvalid={touched.turma && !!errors.turma}
                  disabled={turmas.length === 0}
                >
                  <option value={0}>Selecione uma turma</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>
                      {turma.codigoTurma} - {turma.disciplina?.nome}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.turma}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Aluno</Form.Label>
                <Form.Select
                  name="aluno"
                  value={values.aluno}
                  onChange={handleChange}
                  isInvalid={touched.aluno && !!errors.aluno}
                  disabled={alunos.length === 0}
                >
                  <option value={0}>Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} ({aluno.matricula})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.aluno}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="ativo"
                  name="ativo"
                  label="Ativo"
                  checked={values.ativo}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/turma-alunos')}
                  className="d-flex align-items-center gap-1"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !turmas.length || !alunos.length}
                  className="d-flex align-items-center gap-1"
                >
                  <Save size={18} />
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default TurmaAlunoForm;