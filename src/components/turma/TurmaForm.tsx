import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Save, ArrowLeft } from 'lucide-react';
import { turmaService } from '../../services/turmaService';
import { disciplinaService } from '../../services/disciplinaService';
import { professorService } from '../../services/professorService';
import { salaService } from '../../services/salaService';
import { Turma, Disciplina, Professor, Sala } from '../../types';
import Loading from '../common/Loading';

const validationSchema = Yup.object().shape({
  codigoTurma: Yup.string()
    .required('Código da turma é obrigatório')
    .max(10, 'Código deve ter no máximo 10 caracteres'),
  disciplina_id: Yup.number()
    .required('Disciplina é obrigatória')
    .positive('Selecione uma disciplina válida'),
  professor_id: Yup.number()
    .required('Professor é obrigatório')
    .positive('Selecione um professor válido'),
  sala_id: Yup.number()
    .required('Sala é obrigatória')
    .positive('Selecione uma sala válida'),
  horario: Yup.number()
    .required('Horário é obrigatório')
    .min(1, 'Horário deve ser no mínimo 1')
    .max(24, 'Horário deve ser no máximo 24'),
  ativo: Yup.boolean().required('Status é obrigatório')
});

const TurmaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [initialValues, setInitialValues] = useState<Turma>({
    codigoTurma: '',
    disciplina_id: 0,
    professor_id: 0,
    sala_id: 0,
    horario: 8,
    ativo: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disciplinasData, professoresData, salasData] = await Promise.all([
          disciplinaService.getAll(),
          professorService.getAll(),
          salaService.getAll()
        ]);
        
        setDisciplinas(disciplinasData);
        setProfessores(professoresData);
        setSalas(salasData);
        
        if (id) {
          const turmaData = await turmaService.getById(parseInt(id));
          setInitialValues(turmaData);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values: Turma) => {
    try {
      setLoading(true);
      if (id) {
        await turmaService.update(parseInt(id), values);
      } else {
        await turmaService.create(values);
      }
      navigate('/turmas');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar turma');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados..." />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-primary text-white">
        {id ? 'Editar Turma' : 'Nova Turma'}
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {(!disciplinas.length || !professores.length || !salas.length) && (
          <Alert variant="warning">
            Para criar uma turma, é necessário ter disciplinas, professores e salas cadastrados.
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
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Código da Turma</Form.Label>
                    <Form.Control
                      type="text"
                      name="codigoTurma"
                      value={values.codigoTurma}
                      onChange={handleChange}
                      isInvalid={touched.codigoTurma && !!errors.codigoTurma}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.codigoTurma}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Horário</Form.Label>
                    <Form.Control
                      type="number"
                      name="horario"
                      value={values.horario}
                      onChange={handleChange}
                      isInvalid={touched.horario && !!errors.horario}
                      min={1}
                      max={24}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.horario}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Disciplina</Form.Label>
                <Form.Select
                  name="disciplina_id"
                  value={values.disciplina_id}
                  onChange={handleChange}
                  isInvalid={touched.disciplina_id && !!errors.disciplina_id}
                  disabled={disciplinas.length === 0}
                >
                  <option value={0}>Selecione uma disciplina</option>
                  {disciplinas.map(disciplina => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome} ({disciplina.carga_horaria}h)
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.disciplina_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Professor</Form.Label>
                <Form.Select
                  name="professor_id"
                  value={values.professor_id}
                  onChange={handleChange}
                  isInvalid={touched.professor_id && !!errors.professor_id}
                  disabled={professores.length === 0}
                >
                  <option value={0}>Selecione um professor</option>
                  {professores.map(professor => (
                    <option key={professor.id} value={professor.id}>
                      {professor.nome} ({professor.matricula})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.professor_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sala</Form.Label>
                <Form.Select
                  name="sala_id"
                  value={values.sala_id}
                  onChange={handleChange}
                  isInvalid={touched.sala_id && !!errors.sala_id}
                  disabled={salas.length === 0}
                >
                  <option value={0}>Selecione uma sala</option>
                  {salas.map(sala => (
                    <option key={sala.id} value={sala.id}>
                      Sala {sala.numero} (Capacidade: {sala.capacidade})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.sala_id}
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
                  onClick={() => navigate('/turmas')}
                  className="d-flex align-items-center gap-1"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !disciplinas.length || !professores.length || !salas.length}
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

export default TurmaForm;