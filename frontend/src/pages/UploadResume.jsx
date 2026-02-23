const UploadResume = () => {
  return (
    <div className="max-w-[1000px] mx-auto py-20">
      <div className="bg-white rounded-[3rem] p-16 shadow-xl shadow-indigo-100/50 text-center border border-indigo-50">
        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-indigo-600">
          <Upload size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to scan?</h2>
        <p className="text-gray-400 font-medium mb-10">Upload your PDF or DOCX file to get a deep AI analysis and ATS score.</p>
        <button className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
          Select Resume File
        </button>
      </div>
    </div>
  );
};
export default UploadResume;