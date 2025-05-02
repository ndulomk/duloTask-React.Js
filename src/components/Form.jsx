import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { motion, } from 'framer-motion';
import { FiX, FiCalendar, FiEdit3, FiInfo } from 'react-icons/fi';
import dayjs from 'dayjs';

const API_URL = import.meta.env.VITE_API_URL

function Form({ setShowModal, fetchTasks, setErrorGlob }) {
  const [formData, setFormData] = useState({
    meta: '',
    motivo: '',
    prazo: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMinDateTime = () => {
      return dayjs().format('YYYY-MM-DDTHH:mm');
  }

  const validateField = (name, value) => {
    let error = '';
    if (name === 'meta') {
      if (!value.trim()) error = 'A meta é obrigatória';
      else if (value.length < 3) error = 'Mínimo de 3 caracteres';
      else if (value.length > 100) error = 'Máximo de 100 caracteres';
    }
    if (name === 'motivo' && value.length > 250) {
      error = 'Máximo de 250 caracteres';
    }
    if (name === 'prazo') {
      if (!value) error = 'O prazo é obrigatório';
      else {
        const prazoDate = dayjs(value);
        if (!prazoDate.isValid()) error = 'Data e hora inválidas';
        else if (prazoDate.isBefore(dayjs())) error = 'O prazo não pode ser no passado';
      }
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
    setErrorGlob('');
    const { meta, motivo, prazo } = formData;

    const validationErrors = {
      meta: validateField('meta', meta),
      motivo: validateField('motivo', motivo),
      prazo: validateField('prazo', prazo),
    };
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/task`,
        { meta, motivo, prazo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || 'Erro ao criar tarefa. Tente novamente.',
      });
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

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Adicionar Nova Tarefa
          </h2>

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
                 <FiEdit3/>
              </span>
            <input
              className={`w-full border ${
                errors.meta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'
              } p-3 pl-10 rounded-lg text-sm focus:ring-2 outline-none transition-all`}
              type="text"
              name="meta"
              value={formData.meta}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Qual é a sua meta?"
              maxLength={100}
              aria-invalid={!!errors.meta}
              aria-describedby={errors.meta ? "meta-error" : undefined}
            />
            {errors.meta && <motion.p
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
             id="meta-error" className="text-red-500 text-xs mt-1 pl-2">{errors.meta}</motion.p>}
          </div>

          <div className="relative">
             <span className="absolute left-3 top-3 text-gray-400">
                 <FiInfo/>
              </span>
            <textarea
              className={`w-full border ${
                errors.motivo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'
              } p-3 pl-10 rounded-lg text-sm focus:ring-2 outline-none transition-all resize-none h-24`}
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Descreva o motivo ou detalhes (opcional)"
              maxLength={250}
               aria-invalid={!!errors.motivo}
               aria-describedby={errors.motivo ? "motivo-error" : undefined}
            />
            {errors.motivo && <motion.p
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
             id="motivo-error" className="text-red-500 text-xs mt-1 pl-2">{errors.motivo}</motion.p>}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                 <FiCalendar/>
              </span>
            <input
              className={`w-full border ${
                errors.prazo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'
              } p-3 pl-10 rounded-lg text-sm focus:ring-2 outline-none transition-all appearance-none`}
              type="datetime-local"
              name="prazo"
              value={formData.prazo}
              onChange={handleChange}
              onBlur={handleBlur}
              min={getMinDateTime()}
              aria-invalid={!!errors.prazo}
              aria-describedby={errors.prazo ? "prazo-error" : undefined}
            />
            {errors.prazo && <motion.p
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
             id="prazo-error" className="text-red-500 text-xs mt-1 pl-2">{errors.prazo}</motion.p>}
          </div>

          <motion.button
             whileHover={{ scale: 1.02, y:-2, boxShadow: '0 4px 15px rgba(0, 180, 219, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg py-3 font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? 'Cadastrando Tarefa...' : 'Cadastrar Tarefa'}
          </motion.button>
        </motion.form>
      </motion.div>
  );
}

Form.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
  setErrorGlob: PropTypes.func.isRequired,
};

export default Form;