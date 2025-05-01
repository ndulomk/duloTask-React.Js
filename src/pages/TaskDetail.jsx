import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import CountdownTimer from '../components/CountDownTimer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/task/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data.task);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar tarefa');
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/task/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/');
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao deletar tarefa');
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 flex flex-col"
    >
      <nav className="bg-cyan-600 text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Detalhes da Tarefa</h1>
      </nav>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl p-8 shadow-md border border-gray-200 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{task.meta}</h2>
          <p className="text-gray-600 mb-4">{task.motivo || 'Sem motivo especificado'}</p>
          <p className="text-gray-800 font-medium mb-4">
            Prazo: {dayjs(task.prazo).format('DD/MM/YYYY HH:mm')}
          </p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tempo Restante
            </h3>
            <CountdownTimer deadline={task.prazo} />
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-600 rounded-lg py-2 font-medium hover:bg-gray-300 transition-colors"
            >
              Voltar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="w-full bg-red-500 text-white rounded-lg py-2 font-medium hover:bg-red-600 transition-colors"
            >
              Deletar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TaskDetail;