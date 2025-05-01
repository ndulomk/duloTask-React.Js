import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Form({ setShowModal }) {
  const [formData, setFormData] = useState({
    meta: '',
    motivo: '',
    prazo: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
    if (name === 'meta') {
      if (!value.trim()) error = 'A meta é obrigatória';
      else if (value.length < 3) error = 'A meta deve ter pelo menos 3 caracteres';
      else if (value.length > 100) error = 'A meta não pode exceder 100 caracteres';
    }
    if (name === 'motivo' && value.length > 200) {
      error = 'O motivo não pode exceder 200 caracteres';
    }
    if (name === 'prazo') {
      if (!value) error = 'O prazo é obrigatório';
      else {
        const prazoDate = new Date(value);
        if (isNaN(prazoDate.getTime())) error = 'Data e hora inválidas';
        else if (prazoDate < new Date()) error = 'O prazo não pode be no passado';
      }
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
    const { meta, motivo, prazo } = formData;

    const newErrors = {
      meta: validateField('meta', meta),
      motivo: validateField('motivo', motivo),
      prazo: validateField('prazo', prazo),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/task`,
        { meta, motivo, prazo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      navigate(0);
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || 'Erro ao criar tarefa. Tente novamente.',
      });
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
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Crie Sua Tarefa
          </h2>
          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}
          <div>
            <input
              className={`w-full border ${
                errors.meta ? 'border-red-500' : 'border-gray-300'
              } p-3 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
              type="text"
              name="meta"
              value={formData.meta}
              onChange={handleChange}
              placeholder="Qual é a sua meta?"
            />
            {errors.meta && <p className="text-red-500 text-xs mt-1">{errors.meta}</p>}
          </div>
          <div>
            <input
              className={`w-full border ${
                errors.motivo ? 'border-red-500' : 'border-gray-300'
              } p-3 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
              type="text"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Por que isso é importante?"
            />
            {errors.motivo && <p className="text-red-500 text-xs mt-1">{errors.motivo}</p>}
          </div>
          <div>
            <input
              className={`w-full border ${
                errors.prazo ? 'border-red-500' : 'border-gray-300'
              } p-3 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
              type="datetime-local"
              name="prazo"
              value={formData.prazo}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.prazo && <p className="text-red-500 text-xs mt-1">{errors.prazo}</p>}
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
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

Form.propTypes = {
  setShowModal: PropTypes.func.isRequired,
};

export default Form;