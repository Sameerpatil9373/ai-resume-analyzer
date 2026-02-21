import Card from "../components/ui/Card";
import ProgressCircle from "../components/ui/ProgressCircle";
const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Dashboard Overview
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
          title="ATS Score"
          value="82%"
          subtitle="Resume optimization score"
        />
        <Card 
          title="Job Match"
          value="76%"
          subtitle="Matched with selected role"
        />
        <Card 
          title="AI Reports"
          value="4"
          subtitle="Generated insights available"
        />
      </div>
     {/* ATS Section */}
<div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-between">
  
  <div>
    <h3 className="text-xl font-semibold mb-2">
      Resume ATS Performance
    </h3>
    <p className="text-gray-500">
      Your resume is well optimized but can improve with stronger keywords and quantified results.
    </p>
  </div>

  <ProgressCircle percentage={82} />
</div>
      
  
    </div>
  );
};

export default Dashboard;