import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Save, ArrowLeft } from 'lucide-react';
import { alunoService } from '../../services/alunoService';
import { Aluno } from '../../types';
import Loading from '../common/Loading';

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  email: Yup.string()
    .required('Email é obrigatório')
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  matricula: Yup.string()
    .required('Matrícula é obrigatória')
    .max(30, 'Matrícula deve ter no máximo 30 caracteres'),
  dataNascimento: Yup.date()
    .required('Data de nascimento é obrigatória')
    .max(new Date(), 'Data de nascimento não pode ser futura'),
  ativo: Yup.boolean().required('Status é obrigatório')
});

const AlunoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Aluno>({
    nome: '',
    email: '',
    matricula: '',
    dataNascimento: '',
    ativo: true
  });

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        if (id) {
          const data = await alunoService.getById(parseInt(id));
          setInitialValues({
            ...data,
            dataNascimento: data.dataNascimento.split('T')[0] // Format for input date
          });
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar aluno');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAluno();
    }
  }, [id]);

  const handleSubmit = async (values: Aluno) => {
    try {
      setLoading(true);
      if (id) {
        await alunoService.update(parseInt(id), values);
      } else {
        await alunoService.create(values);
      }
      navigate('/alunos');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar aluno');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados do aluno..." />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-primary text-white">
        {id ? 'Editar Aluno' : 'Novo Aluno'}
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
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
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={values.nome}
                  onChange={handleChange}
                  isInvalid={touched.nome && !!errors.nome}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nome}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Matrícula</Form.Label>
                <Form.Control
                  type="text"
                  name="matricula"
                  value={values.matricula}
                  onChange={handleChange}
                  isInvalid={touched.matricula && !!errors.matricula}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.matricula}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="dataNascimento"
                  value={values.dataNascimento}
                  onChange={handleChange}
                  isInvalid={touched.dataNascimento && !!errors.dataNascimento}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dataNascimento}
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
                  onClick={() => navigate('/alunos')}
                  className="d-flex align-items-center gap-1"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
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

export default AlunoForm;