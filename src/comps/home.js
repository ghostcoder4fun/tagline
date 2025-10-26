import { useState } from "react";
import { Clock, DollarSign, Play } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const tasks = [
    { id: 1, title: "Label Images for AI", time: "2 min", price: "$0.10" },
    { id: 2, title: "Transcribe Short Audio", time: "5 min", price: "$0.30" },
    { id: 3, title: "Categorize Social Posts", time: "3 min", price: "$0.15" },
    { id: 4, title: "Verify Product Listings", time: "4 min", price: "$0.25" },
    { id: 5, title: "Detect Emotion in Text", time: "6 min", price: "$0.35" },
    { id: 6, title: "Classify Road Signs", time: "4 min", price: "$0.20" },
    { id: 7, title: "Tag Video Frames", time: "5 min", price: "$0.28" },
    { id: 8, title: "Review Translations", time: "3 min", price: "$0.22" },
    { id: 9, title: "Evaluate Chat Responses", time: "7 min", price: "$0.40" },
    { id: 10, title: "Label Emotions in Tweets", time: "3 min", price: "$0.12" },
  ];

  // Filter tasks based on search input
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-white"
      style={{ paddingTop: "calc(4rem + env(safe-area-inset-top))" }}
    >
      <div className="flex-grow px-4 sm:px-6 pt-28 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Microtasks Dashboard
          </h1>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full max-w-md sm:max-w-lg px-5 py-3 rounded-xl border border-[#bf1c1c]/50 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bf1c1c] transition-all text-base sm:text-lg"
            />
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <div
                  key={task.id}
                  className="group border border-[#bf1c1c]/40 bg-black rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-md hover:shadow-[#bf1c1c]/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#bf1c1c]"
                >
                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 group-hover:text-[#bf1c1c] transition-colors">
                    {task.title}
                  </h2>

                  {/* Task Details */}
                  <div className="space-y-2 mb-6 text-gray-400 text-sm sm:text-base">
                    <p className="flex items-center gap-2">
                      <Clock size={18} className="text-[#bf1c1c]" />
                      <span>
                        Time: <span className="text-white">{task.time}</span>
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign size={18} className="text-[#bf1c1c]" />
                      <span>
                        Price: <span className="text-white">{task.price}</span>
                      </span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="flex items-center justify-center gap-2 bg-[#bf1c1c] text-white font-semibold py-3 rounded-xl hover:bg-[#a61515] active:scale-95 transition-all text-sm sm:text-base">
                    <Play size={18} />
                    Start Task
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full text-base sm:text-lg">
                No tasks found matching your search.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 sm:gap-3 mt-10 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl border border-[#bf1c1c]/50 text-sm sm:text-base ${
                  currentPage === 1
                    ? "text-gray-500 border-gray-700 cursor-not-allowed"
                    : "text-white hover:bg-[#bf1c1c]/20 transition"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border text-sm sm:text-base ${
                    currentPage === i + 1
                      ? "bg-[#bf1c1c] border-[#bf1c1c] text-white"
                      : "border-[#bf1c1c]/40 text-gray-400 hover:border-[#bf1c1c] hover:text-white transition"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl border border-[#bf1c1c]/50 text-sm sm:text-base ${
                  currentPage === totalPages
                    ? "text-gray-500 border-gray-700 cursor-not-allowed"
                    : "text-white hover:bg-[#bf1c1c]/20 transition"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-[#bf1c1c]/40 mt-10 p-6 text-center text-gray-400 text-sm sm:text-base">
        <p>© 2025 Tagline. All rights reserved.</p>
        <p className="mt-1">
          Built with ❤️
        </p>
      </footer>
    </div>
  );
}
