import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("Sameer Patil");
  const [email, setEmail] = useState("sameerpatil9637@gmail.com");
  const [role, setRole] = useState("Full Stack Developer");
  const [format, setFormat] = useState("PDF");
  const [aiEnabled, setAiEnabled] = useState(true);

  const handleSave = () => {
    console.log({ name, email, role, format, aiEnabled });
    alert("Preferences saved!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">
        Manage your account details and AI preferences
      </p>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">

        {/* Account Section */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Account Information</h2>

          <div className="space-y-4">
            <input
              className="w-full border rounded-lg p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />

            <input
              className="w-full border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        </div>

        {/* AI Preferences */}
        <div>
          <h2 className="font-semibold text-lg mb-4">AI Preferences</h2>

          <div className="space-y-4">

            <select
              className="w-full border rounded-lg p-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Full Stack Developer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Data Analyst</option>
            </select>

            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={format === "PDF"}
                  onChange={() => setFormat("PDF")}
                /> PDF
              </label>

              <label>
                <input
                  type="radio"
                  checked={format === "DOCX"}
                  onChange={() => setFormat("DOCX")}
                /> DOCX
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span>Enable AI Suggestions</span>

              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={() => setAiEnabled(!aiEnabled)}
              />
            </div>

          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Save Preferences
        </button>

      </div>
    </div>
  );
}