import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

function CountdownTimer({ deadline }) {
  const calculateTimeLeft = () => {
    const now = dayjs();
    const end = dayjs(deadline);
    const diff = end.diff(now);

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, expired: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.expired) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, timeLeft.expired]); 

  const timeUnits = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

   const unitVariants = {
      initial: { y: 10, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -10, opacity: 0 }
   };

  if (timeLeft.expired) {
    return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
        className="text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg"
      >
        Prazo Expirado
      </motion.div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-center">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          variants={unitVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center p-3 shadow-sm min-w-[70px]"
        >
          <span className="text-3xl font-bold text-black">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

CountdownTimer.propTypes = {
  deadline: PropTypes.string.isRequired,
};

export default CountdownTimer;