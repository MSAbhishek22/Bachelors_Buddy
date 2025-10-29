"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";

export default function AddExpenseButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 md:bottom-6 z-40 w-14 h-14 rounded-full gradient-sunrise shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
      >
        <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
      </button>
      <AddExpenseModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
