import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import { FiCheckCircle, FiCircle, FiInfo } from 'react-icons/fi';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

function TaskCard({ task, toggleTaskCompletion, }) {
  const getTimeRemaining = (deadline) => {
    const now = dayjs();
    const end = dayjs(deadline);
    if (task.completed) return 'Concluída';
    if (end.isBefore(now)) return 'Prazo expirado';
    return `Expira ${end.fromNow()}`;
  };

  const isExpired = !task.completed && dayjs(task.prazo).isBefore(dayjs());

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-white rounded-xl p-5 shadow-lg border ${
         task.completed ? 'border-green-200 bg-green-50' : isExpired ? 'border-red-200 bg-red-50' : 'border-gray-200'
      } flex flex-col justify-between h-full`}
    >
      <div>
         <div className='flex justify-between items-center mb-2'>
            <h3
              className={`text-lg font-semibold truncate pr-2 ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}
            >
              {task.meta}
            </h3>
             <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.completed ? 'bg-green-100 text-green-700' : isExpired ? 'bg-red-100 text-red-700' : 'bg-cyan-100 text-cyan-700'
             }`}>
                 {task.completed ? 'Concluída' : isExpired ? 'Expirada' : 'Pendente'}
             </span>
         </div>

        <p className="text-sm text-gray-600 mt-1 mb-3 h-10 overflow-hidden text-ellipsis">
          {task.motivo || 'Sem descrição adicional.'}
        </p>
        <div className="mt-3 mb-4 border-t border-t-zinc-300 pt-3">
          <p className="text-xs font-medium text-gray-500">
            Prazo: {dayjs(task.prazo).format('DD/MM/YY HH:mm')}
          </p>
          <p
            className={`text-sm font-semibold mt-1 ${
              task.completed ? 'text-green-600' : isExpired ? 'text-red-600' : 'text-cyan-600'
            }`}
          >
            {getTimeRemaining(task.prazo)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <motion.button
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleTaskCompletion(task._id)}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
            task.completed
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
          }`}
          title={task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
        >
          {task.completed ? <FiCircle size={16} /> : <FiCheckCircle size={16} />}
          <span>{task.completed ? 'Pendente' : 'Concluir'}</span>
        </motion.button>

        <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }} className="flex-1">
          <Link
            to={`/task/${task._id}`}
            className="flex-1 flex items-center justify-center gap-1 w-full py-2 px-3 rounded-lg font-medium text-sm transition-all bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border border-cyan-200"
            title="Ver Detalhes da Tarefa"
          >
            <FiInfo size={16} />
            <span>Detalhes</span>
          </Link>
        </motion.div>

      </div>
    </motion.div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  toggleTaskCompletion: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TaskCard;