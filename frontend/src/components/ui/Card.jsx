const Card = ({ title, value, subtitle }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
  );
};

export default Card;