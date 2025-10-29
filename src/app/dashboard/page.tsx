"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import AddExpenseButton from "@/components/AddExpenseButton";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const COLORS = ["#FF6B35", "#FFB5A7", "#F4A261", "#E76F51", "#E9C46A"];

export default function DashboardPage() {
  const { currentRoom, deleteExpense } = useApp();
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    if (!currentRoom) return;

    // Calculate balances
    const newBalances: Record<string, number> = {};
    currentRoom.members.forEach((member) => {
      newBalances[member] = 0;
    });

    currentRoom.expenses.forEach((expense) => {
      const shareAmount = expense.amount / expense.splitBetween.length;
      
      // Add to the person who paid
      newBalances[expense.paidBy] += expense.amount;
      
      // Subtract from everyone who needs to pay
      expense.splitBetween.forEach((member) => {
        newBalances[member] -= shareAmount;
      });
    });

    setBalances(newBalances);

    // Check if balanced (all balances close to 0)
    const isBalanced = Object.values(newBalances).every(
      (balance) => Math.abs(balance) < 0.5
    );
    
    // Trigger confetti if balanced and expenses exist
    if (isBalanced && currentRoom.expenses.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Calculate category breakdown
    const categoryTotals: Record<string, number> = {};
    currentRoom.expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(chartData);
  }, [currentRoom]);

  const handleDelete = (expenseId: string) => {
    deleteExpense(expenseId);
    toast.success("Expense deleted");
  };

  if (!currentRoom) {
    return (
      <div className="min-h-screen pt-20 pb-24 px-4">
        <Navigation />
        <div className="text-center py-20">
          <p className="text-muted-foreground">No room selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 md:pt-24">
      <Navigation />
      <AddExpenseButton />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            {currentRoom.name}
          </h1>
          <p className="text-muted-foreground">
            {currentRoom.members.length} members · {currentRoom.expenses.length}{" "}
            expenses
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Expenses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
              {currentRoom.expenses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No expenses yet. Add one to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {currentRoom.expenses
                    .slice()
                    .reverse()
                    .map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-start justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold">
                              {expense.description}
                            </h3>
                            <span className="text-lg font-bold text-primary ml-4">
                              ${expense.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              {expense.category}
                            </span>
                            <span>Paid by {expense.paidBy}</span>
                            <span>·</span>
                            <span>
                              Split: {expense.splitBetween.join(", ")}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id)}
                          className="ml-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Balances & Chart */}
          <div className="space-y-4">
            {/* Balance Card */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">Balance</h2>
              <div className="space-y-3">
                {currentRoom.members.map((member) => {
                  const balance = balances[member] || 0;
                  const isPositive = balance > 0.5;
                  const isNegative = balance < -0.5;
                  const isBalanced = Math.abs(balance) <= 0.5;

                  return (
                    <div
                      key={member}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
                    >
                      <span className="font-medium">{member}</span>
                      <div className="flex items-center gap-2">
                        {isBalanced && <Check className="w-4 h-4 text-green-500" />}
                        <span
                          className={`font-semibold ${
                            isPositive
                              ? "text-green-600"
                              : isNegative
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isPositive && "+"}${Math.abs(balance).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold mb-4">
                  Category Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
