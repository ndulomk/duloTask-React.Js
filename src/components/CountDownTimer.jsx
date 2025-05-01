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
  }, [timeLeft.expired]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      {timeLeft.expired ? (
        <p className="text-red-600 font-semibold">Prazo expirado</p>
      ) : (
        <div className="flex justify-center gap-4 text-gray-800">
          <div>
            <span className="text-2xl font-bold">{timeLeft.days}</span>
            <p className="text-sm">Dias</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{timeLeft.hours}</span>
            <p className="text-sm">Horas</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{timeLeft.minutes}</span>
            <p className="text-sm">Minutos</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{timeLeft.seconds}</span>
            <p className="text-sm">Segundos</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

CountdownTimer.propTypes = {
  deadline: PropTypes.string.isRequired,
};

export default CountdownTimer;