"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PersonalPage() {
  const { personalExpenses } = useApp();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  
  const monthlyBudget = 800;

  useEffect(() => {
    // Calculate weekly data
    const weeklyTotals: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    personalExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dayName = days[date.getDay()];
      weeklyTotals[dayName] += expense.amount;
    });

    const chartData = Object.entries(weeklyTotals).map(([day, amount]) => ({
      day,
      amount,
    }));

    setWeeklyData(chartData);

    // Calculate total
    const total = personalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalSpent(total);

    // Calculate category totals
    const catTotals: Record<string, number> = {};
    personalExpenses.forEach((expense) => {
      if (!catTotals[expense.category]) {
        catTotals[expense.category] = 0;
      }
      catTotals[expense.category] += expense.amount;
    });
    setCategoryTotals(catTotals);
  }, [personalExpenses]);

  const budgetPercentage = (totalSpent / monthlyBudget) * 100;
  const isOverBudget = budgetPercentage > 100;

  // AI Insights
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const avgDailySpend = totalSpent / 7;

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 md:pt-24">
      <Navigation />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Personal Expenses
          </h1>
          <p className="text-muted-foreground">Track your personal spending</p>
        </div>

        {/* Budget Overview */}
        <div className="bg-card rounded-3xl p-6 mb-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Monthly Budget</h2>
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <>
                  <TrendingUp className="w-5 h-5 text-destructive" />
                  <span className="text-destructive font-semibold">Over Budget</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-semibold">On Track</span>
                </>
              )}
            </div>
          </div>
          <div className="mb-2">
            <Progress
              value={Math.min(budgetPercentage, 100)}
              className="h-3"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${totalSpent.toFixed(2)} spent
            </span>
            <span className="text-muted-foreground">
              ${monthlyBudget.toFixed(2)} budget
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Weekly Chart & AI Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Spending Chart */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">Weekly Spending</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFE0D9" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #FFE0D9",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="amount" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-orange-50 to-peach-50 dark:from-orange-950/20 dark:to-peach-950/20 rounded-3xl p-6 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">AI Insights</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Top Spending Category
                  </p>
                  <p className="text-lg font-semibold">
                    {topCategory ? (
                      <>
                        {topCategory[0]} - ${topCategory[1].toFixed(2)}
                      </>
                    ) : (
                      "No expenses yet"
                    )}
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Average Daily Spend
                  </p>
                  <p className="text-lg font-semibold">
                    ${avgDailySpend.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    💡 Recommendation
                  </p>
                  <p className="text-sm">
                    {isOverBudget
                      ? "You're over budget this month. Consider reducing spending on " +
                        (topCategory ? topCategory[0] : "top categories") +
                        "."
                      : "Great job! You're staying within your budget. Keep it up!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Expenses & Category Breakdown */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">By Category</h2>
              <div className="space-y-3">
                {Object.entries(categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => {
                    const percentage = (amount / totalSpent) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground">
                            ${amount.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">Recent</h2>
              <div className="space-y-3">
                {personalExpenses.slice(0, 5).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-start p-3 bg-muted/30 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {expense.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {expense.category}
                      </p>
                    </div>
                    <span className="font-semibold text-primary">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
