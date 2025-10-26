import { useState } from "react";
import { DollarSign, ArrowUp, CreditCard } from "lucide-react";

export default function Payments() {
  const [balance, setBalance] = useState(12.45);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions] = useState([
    { id: 1, type: "Credit", amount: 2.5, date: "2025-10-25" },
    { id: 2, type: "Credit", amount: 5.0, date: "2025-10-24" },
    { id: 3, type: "Withdrawal", amount: 3.0, date: "2025-10-23" },
    { id: 4, type: "Credit", amount: 8.0, date: "2025-10-22" },
  ]);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount to withdraw");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }
    setBalance((prev) => prev - amount);
    alert(`Withdrawal of $${amount.toFixed(2)} requested successfully!`);
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-[#bf1c1c]">
          Payments & Balance
        </h2>

        {/* Current Balance Card */}
        <div className="bg-black/80 border border-[#bf1c1c]/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 shadow-md hover:shadow-[#bf1c1c]/20 transition-all">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <DollarSign size={28} className="text-[#bf1c1c]" />
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Current Balance</p>
              <p className="text-2xl sm:text-3xl font-bold">${balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-3">
            <input
              type="number"
              min="0"
              placeholder="Amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full sm:w-40 p-3 rounded-xl border border-[#bf1c1c]/40 bg-black text-white placeholder-gray-400 focus:outline-none focus:border-[#bf1c1c]"
            />
            <button
              onClick={handleWithdraw}
              className="w-full sm:w-auto bg-[#bf1c1c] hover:bg-[#a61515] py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <ArrowUp size={18} />
              Withdraw
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#bf1c1c]">Transaction History</h3>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border border-[#bf1c1c]/40 bg-black/80 shadow-md hover:shadow-[#bf1c1c]/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto justify-between sm:justify-start">
                    <CreditCard
                      size={20}
                      className={tx.type === "Credit" ? "text-green-400" : "text-yellow-400"}
                    />
                    <p className="text-sm sm:text-base">
                      {tx.type} of <span className="font-semibold">${tx.amount.toFixed(2)}</span>
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm">{tx.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
