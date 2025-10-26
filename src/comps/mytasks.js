import { useState } from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function MyTasks() {
  const [tasks] = useState([
    {
      id: 1,
      title: "Image Classification Task",
      status: "Completed",
      duration: "2.5 min",
      earnings: "$0.10",
    },
    {
      id: 2,
      title: "Survey Response",
      status: "In Progress",
      duration: "4 min",
      earnings: "$0.05",
    },
    {
      id: 3,
      title: "Text Labeling",
      status: "Pending",
      duration: "3 min",
      earnings: "$0.08",
    },
    {
      id: 4,
      title: "Audio Transcription",
      status: "Completed",
      duration: "5 min",
      earnings: "$0.12",
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-green-400 shrink-0" size={20} />;
      case "In Progress":
        return <Clock className="text-yellow-400 shrink-0" size={20} />;
      default:
        return <AlertCircle className="text-gray-400 shrink-0" size={20} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-6"
      style={{
        paddingTop: "calc(4rem + env(safe-area-inset-top))",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[#bf1c1c]">
          My Tasks
        </h2>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-black border border-[#bf1c1c]/40 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-[#bf1c1c]/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Title and Icon */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg sm:text-xl truncate pr-2">
                  {task.title}
                </h3>
                {getStatusIcon(task.status)}
              </div>

              {/* Task Info */}
              <div className="space-y-2 mb-5 text-gray-400 text-sm sm:text-base">
                <p className="flex items-center gap-2">
                  ⏱ Duration:
                  <span className="text-white">{task.duration}</span>
                </p>
                <p className="flex items-center gap-2">
                  💰 Reward:
                  <span className="text-[#bf1c1c]">{task.earnings}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full w-fit ${
                  task.status === "Completed"
                    ? "bg-green-500/20 text-green-400 border border-green-400/40"
                    : task.status === "In Progress"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/40"
                    : "bg-gray-700/40 text-gray-400 border border-gray-600/40"
                }`}
              >
                {task.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
