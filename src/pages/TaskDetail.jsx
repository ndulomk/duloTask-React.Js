import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import CountdownTimer from '../components/CountDownTimer';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
         if (!token) {
             navigate('/');
             return;
         }
        const response = await axios.get(`${API_URL}/task/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data.task);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar tarefa');
        if (error.response?.status === 401) {
           localStorage.removeItem('token');
           navigate('/');
        }
      } finally {
          setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa permanentemente?')) {
      try {
         setError('');
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

   const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
      </div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10 px-4"
    >
       <div className="w-full max-w-3xl">
         <motion.button
             whileHover={{ scale: 1.05, x: -5 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => navigate('/')}
             className="flex items-center gap-2 mb-6 text-cyan-700 hover:text-cyan-800 transition-colors font-medium"
           >
             <FiArrowLeft />
             Voltar para Lista
           </motion.button>

        {error && (
           <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-6 w-full"
              role="alert"
           >
              <span className="block sm:inline">{error}</span>
           </motion.div>
        )}

        {task && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xl border border-gray-200 w-full"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{task.meta}</h1>
              <p className={`text-sm font-medium mb-4 ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {task.completed ? 'Concluída' : 'Pendente'}
              </p>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">{task.motivo || 'Sem motivo adicional.'}</p>

              <div className="mb-6 border-t border-t-zinc-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Prazo
                </h3>
                 <p className="text-gray-700 mb-4 text-lg">
                    {dayjs(task.prazo).format('dddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
                 </p>
                 <h4 className="text-md font-semibold text-gray-800 mb-2">
                    Tempo Restante
                 </h4>
                <CountdownTimer deadline={task.prazo} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 border-t-zinc-200 border-t pt-6">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#ef4444', color: '#ffffff' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-100 text-red-600 rounded-lg px-5 py-3 font-medium hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 />
                  Deletar Tarefa
                </motion.button>
              </div>
            </motion.div>
        )}
       </div>
    </motion.div>
  );
}

export default TaskDetail;