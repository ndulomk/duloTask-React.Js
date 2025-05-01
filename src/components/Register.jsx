import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function RegisterModal({ setError, setIsAuthenticated, setShowModal, setShowLoginModal }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'username') {
      if (!value.trim()) error = 'Nome de usuário é obrigatório';
      else if (value.length < 3) error = 'Mínimo de 3 caracteres';
    }
    if (name === 'email') {
      if (!value.trim()) error = 'E-mail é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'E-mail inválido';
    }
    if (name === 'password') {
      if (!value) error = 'Senha é obrigatória';
      else if (value.length < 6) error = 'Mínimo de 6 caracteres';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    const newErrors = {
      username: validateField('username', username),
      email: validateField('email', email),
      password: validateField('password', password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setShowModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar.';
      if (error.response?.data?.conflict === 'email') {
        setErrors((prev) => ({ ...prev, email: 'E-mail já cadastrado' }));
      } else if (error.response?.data?.conflict === 'username') {
        setErrors((prev) => ({ ...prev, username: 'Nome de usuário já cadastrado' }));
      } else {
        setErrors({ form: message });
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.form
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 flex flex-col space-y-4 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Criar Conta</h2>
          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}
          <div>
            <input
              className={`w-full border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } p-3 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nome de usuário"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <input
              className={`w-full border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } p-3 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="relative">
            <input
              className={`w-full border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } p-3 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors"
            >
              {showPassword ? 'Esconder' : 'Mostrar'}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full border border-red-500 text-red-500 rounded-lg py-2 font-medium hover:bg-red-50 transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-cyan-600 text-white rounded-lg py-2 font-medium hover:bg-cyan-700 transition-colors"
            >
              Cadastrar
            </motion.button>
          </div>
          <p className="text-center text-gray-800 text-sm">
            Já tem conta?{' '}
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setShowLoginModal(true);
              }}
              className="text-cyan-600 hover:underline"
            >
              Fazer login
            </button>
          </p>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

RegisterModal.propTypes = {
  setError: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setShowLoginModal: PropTypes.func.isRequired,
};

export default RegisterModal;