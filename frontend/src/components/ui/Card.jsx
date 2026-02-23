const Card = ({ title, value, subtitle, trend, icon: Icon, trendColor = "green" }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm p-8 flex justify-between items-start hover:shadow-xl transition-all duration-300 border border-gray-50">
      <div className="space-y-4">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600">
          {Icon && <Icon size={24} />}
        </div>
        <div>
          <h2 className="text-4xl font-black text-gray-900 leading-tight">{value}</h2>
          <h3 className="text-gray-400 text-sm font-medium mt-1">{title}</h3>
        </div>
      </div>
      {trend && (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
          trendColor === "green" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {trend}
        </span>
      )}
    </div>
  );
};

// ADD THIS LINE AT THE VERY BOTTOM
export default Card;