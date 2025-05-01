import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

function TaskCard({ task, toggleTaskCompletion, deleteTask }) {
  const getTimeRemaining = (deadline) => {
    const now = dayjs();
    const end = dayjs(deadline);
    if (end.isBefore(now)) return 'Prazo expirado';
    return end.fromNow(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-white rounded-xl p-6 shadow-md border border-gray-200 ${
        task.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <Link to={`/task/${task._id}`}>
          <h3
            className={`text-lg font-semibold ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
            } hover:underline`}
          >
            {task.meta}
          </h3>
        </Link>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteTask(task._id)}
          className="text-red-500 hover:text-red-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      </div>
      <p className="text-sm text-gray-600 mt-1">{task.motivo || 'Sem motivo especificado'}</p>
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-800">
          Prazo: {dayjs(task.prazo).format('DD/MM/YYYY HH:mm')}
        </p>
        <p
          className={`text-sm ${
            dayjs(task.prazo).isBefore(dayjs()) ? 'text-red-600' : 'text-cyan-600'
          }`}
        >
          {getTimeRemaining(task.prazo)}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleTaskCompletion(task._id)}
        className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
          task.completed
            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            : 'bg-cyan-600 text-white hover:bg-cyan-700'
        }`}
      >
        {task.completed ? 'Desmarcar' : 'Concluir'}
      </motion.button>
    </motion.div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  toggleTaskCompletion: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TaskCard;