import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { motion, } from 'framer-motion';
import { FiX, FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function RegisterModal({ setError, setIsAuthenticated, setShowModal, setShowLoginModal }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (errors[name] || errors.form) {
       setErrors((prev) => ({ ...prev, [name]: validateField(name, value), form: '' }));
    }
  };

   const handleBlur = (e) => {
     const { name, value } = e.target;
     setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
   }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const { username, email, password } = formData;

    const validationErrors = {
      username: validateField('username', username),
      email: validateField('email', email),
      password: validateField('password', password),
    };
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
       setIsSubmitting(false);
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
      let formError = message;
      if (error.response?.data?.conflict === 'email') {
        setErrors((prev) => ({ ...prev, email: 'E-mail já cadastrado' }));
        formError = '';
      } else if (error.response?.data?.conflict === 'username') {
        setErrors((prev) => ({ ...prev, username: 'Nome de usuário já existe' }));
        formError = '';
      }
        setErrors(prev => ({...prev, form: formError}));
    } finally {
        setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{duration: 0.3}}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={() => setShowModal(false)}
      >
        <motion.form
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 flex flex-col space-y-5 w-full max-w-md relative"
        >
          <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar modal"
            >
              <FiX size={24} />
            </motion.button>

          <h2 className="text-2xl font-bold text-gray-800 text-center">Criar Conta</h2>

          {errors.form && (
             <motion.p
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
                {errors.form}
             </motion.p>
          )}

          <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                 <FiUser/>
              </span>
            <input
              className={`w-full border ${
                errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'
              } p-3 pl-10 rounded-lg text-sm focus:ring-2 outline-none transition-all`}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome de usuário"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <motion.p
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               id="username-error" className="text-red-500 text-xs mt-1 pl-2">
               {errors.username}
               </motion.p>
            )}
          </div>

           <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                 <FiMail/>
              </span>
            <input
              className={`w-full border ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'
              } p-3 pl-10 rounded-lg text-sm focus:ring-2 outline-none transition-all`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="E-mail"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <motion.p
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
            id="email-error" className="text-red-500 text-xs mt-1 pl-2">{errors.email}</motion.p>}
          </div>

          <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                 <FiLock/>
              </span>
            <input
              className={`w-full border ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'
              } p-3 pl-10 rounded-lg text-sm focus:ring-2 outline-none transition-all pr-10`}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Senha (mínimo 6 caracteres)"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-600 transition-colors"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
            </button>
            {errors.password && (
               <motion.p
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               id="password-error" className="text-red-500 text-xs mt-1 pl-2">{errors.password}</motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y:-2, boxShadow: '0 4px 15px rgba(0, 180, 219, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg py-3 font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </motion.button>

          <p className="text-center text-gray-600 text-sm pt-2">
            Já tem conta?{' '}
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setShowLoginModal(true);
              }}
              className="text-cyan-600 hover:underline font-medium"
            >
              Fazer login
            </button>
          </p>
        </motion.form>
      </motion.div>
  );
}

RegisterModal.propTypes = {
  setError: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setShowLoginModal: PropTypes.func.isRequired,
};

export default RegisterModal;