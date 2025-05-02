import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Form from '../components/Form';
import TaskCard from '../components/TaskCard';
import LoginModal from '../components/Login';
import RegisterModal from '../components/Register';
import { FiLogOut, FiPlus, FiLogIn, FiUserPlus } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function TaskList() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const fetchTasks = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setShowLoginModal(true);
        return;
      }
      const response = await axios.get(`${API_URL}/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data.sort((a, b) => new Date(a.prazo) - new Date(b.prazo)));
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao carregar tarefas');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setShowLoginModal(true);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
       if (!showRegisterModal) {
         setShowLoginModal(true);
       }
    }
  }, [isAuthenticated, showRegisterModal]);

  const toggleTaskCompletion = async (id) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      const task = tasks.find((t) => t._id === id);
      await axios.put(
        `${API_URL}/task/${id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id) => {
     if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
          setError('');
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/task/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTasks((prev) => prev.filter((t) => t._id !== id));
        } catch (error) {
          setError(error.response?.data?.message || 'Erro ao deletar tarefa');
        }
     }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTasks([]);
    setShowLoginModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-zinc-100  flex flex-col"
    >
      <nav className="bg-white text-gray-800 p-4 shadow-md sticky top-0 z-10 backdrop-filter backdrop-blur-lg bg-opacity-80">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-600">Dulo Task</h1>
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#ef4444', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all text-sm"
              >
                <FiLogOut />
                Logout
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowRegisterModal(false);
                    setError('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-all text-sm"
                >
                  <FiLogIn/>
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowRegisterModal(true);
                    setShowLoginModal(false);
                    setError('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all text-sm"
                >
                  <FiUserPlus />
                  Cadastro
                </motion.button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className=" container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          {isAuthenticated && (
             <>
             <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Suas Tarefas
              </h2>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {setShowTaskModal(true); setError('');}}
                className="flex items-center justify-center gap-2 mx-auto px-3 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl text-sm cursor-pointer"
              >
                <FiPlus />
                Adicionar Nova Tarefa
              </motion.button>
             </>
          )}
          {!isAuthenticated && (
             <p className="text-xl text-gray-600 mt-10">Faça login para gerenciar suas tarefas.</p>
          )}
        </div>

        {error && (
           <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-6 max-w-md mx-auto"
              role="alert"
           >
              <span className="block sm:inline">{error}</span>
           </motion.div>
        )}

        {isAuthenticated && tasks?.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 mt-10"
          >
            <p className="text-lg">Nenhuma tarefa cadastrada ainda.</p>
            <p>Clique em "Adicionar Nova Tarefa" para começar!</p>
          </motion.div>
        )}

        {isAuthenticated && tasks?.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
             <AnimatePresence>
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    toggleTaskCompletion={toggleTaskCompletion}
                    deleteTask={deleteTask}
                  />
                ))}
             </AnimatePresence>
          </motion.div>
        )}
      </div>

        <AnimatePresence>
          {showTaskModal && <Form fetchTasks={fetchTasks} setShowModal={setShowTaskModal} setErrorGlob={setError} />}
        </AnimatePresence>
        <AnimatePresence>
          {showLoginModal && (
            <LoginModal
              setError={setError}
              setIsAuthenticated={setIsAuthenticated}
              setShowModal={setShowLoginModal}
              setShowRegisterModal={setShowRegisterModal}
            />
          )}
          </AnimatePresence>
          <AnimatePresence>
          {showRegisterModal && (
            <RegisterModal
              setError={setError}
              setIsAuthenticated={setIsAuthenticated}
              setShowModal={setShowRegisterModal}
              setShowLoginModal={setShowLoginModal}
            />
          )}
        </AnimatePresence>

    </motion.div>
  );
}

export default TaskList;