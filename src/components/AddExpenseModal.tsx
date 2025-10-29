"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "Groceries",
  "Utilities",
  "Household",
  "Food",
  "Entertainment",
  "Transport",
  "Health",
  "Other",
];

export default function AddExpenseModal({
  isOpen,
  onClose,
}: AddExpenseModalProps) {
  const { currentRoom, addExpense } = useApp();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom) {
      toast.error("Please select a room first");
      return;
    }

    if (!description || !amount || !category || !paidBy || splitBetween.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense = {
      id: `exp-${Date.now()}`,
      description,
      amount: parseFloat(amount),
      category,
      paidBy,
      splitBetween,
      date: new Date().toISOString(),
      roomId: currentRoom.id,
    };

    addExpense(expense);
    toast.success("Expense added successfully! 🎉");

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("");
    setPaidBy("");
    setSplitBetween([]);
    onClose();
  };

  const toggleMember = (member: string) => {
    setSplitBetween((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Add Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {currentRoom?.members.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Split Between</Label>
            <div className="mt-2 space-y-2">
              {currentRoom?.members.map((member) => (
                <div key={member} className="flex items-center space-x-2">
                  <Checkbox
                    id={member}
                    checked={splitBetween.includes(member)}
                    onCheckedChange={() => toggleMember(member)}
                  />
                  <label
                    htmlFor={member}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {member}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full gradient-sunrise text-white">
            Add Expense
          </Button>
        </form>
      </div>
    </div>
  );
}
