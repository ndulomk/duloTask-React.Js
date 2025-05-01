import { useState, useEffect } from 'react';

import axios from 'axios';
import { motion } from 'framer-motion';
import Form from '../components/Form';
import TaskCard from '../components/TaskCard';
import LoginModal from '../components/Login';
import RegisterModal from '../components/Register';

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
      const token = localStorage.getItem('token');
      if (!token) {
        setShowLoginModal(true);
        return;
      }
      const response = await axios.get(`${API_URL}/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data);
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
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const toggleTaskCompletion = async (id) => {
    try {
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
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao deletar tarefa');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLoginModal(true);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 flex flex-col"
    >
      <nav className="bg-cyan-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dulo Task</h1>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
            >
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
                }}
                className="px-4 py-2 bg-white text-cyan-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowRegisterModal(true);
                  setShowLoginModal(false);
                }}
                className="px-4 py-2 bg-cyan-700 text-white rounded-lg font-medium hover:bg-cyan-800 transition-all"
              >
                Cadastro
              </motion.button>
            </>
          )}
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Alcance Seus Objetivos com Organização!
          </h2>
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskModal(true)}
              className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-all"
            >
              Adicionar Nova Tarefa
            </motion.button>
          )}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {tasks?.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Nenhuma tarefa cadastrada. Comece agora!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        )}
        {showTaskModal && <Form setShowModal={setShowTaskModal} />}
        {showLoginModal && (
          <LoginModal
            setError={setError}
            setIsAuthenticated={setIsAuthenticated}
            setShowModal={setShowLoginModal}
            setShowRegisterModal={setShowRegisterModal}
          />
        )}
        {showRegisterModal && (
          <RegisterModal
            setError={setError}
            setIsAuthenticated={setIsAuthenticated}
            setShowModal={setShowRegisterModal}
            setShowLoginModal={setShowLoginModal}
          />
        )}
      </div>
    </motion.div>
  );
}

export default TaskList;