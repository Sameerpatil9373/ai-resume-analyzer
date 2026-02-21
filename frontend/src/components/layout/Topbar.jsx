const Topbar = () => {
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4">
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-purple-600 text-white flex items-center justify-center rounded-full">
          SP
        </div>
      </div>
    </div>
  );
};

export default Topbar;