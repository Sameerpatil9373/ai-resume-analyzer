const ProgressCircle = ({ percentage, size = 180, stroke = 12 }) => {
  const radius = (size / 2) - (stroke / 2);
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          stroke="#f1f5f9"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="url(#atsGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ProgressCircle;