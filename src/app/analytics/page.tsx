"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

const COLORS = ["#FF6B35", "#FFB5A7", "#F4A261", "#E76F51", "#E9C46A", "#2A9D8F"];

export default function AnalyticsPage() {
  const { currentRoom, personalExpenses } = useApp();
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    avgExpense: 0,
    totalMembers: 0,
    thisWeekTotal: 0,
  });

  useEffect(() => {
    if (!currentRoom) return;

    // Calculate category data
    const categoryTotals: Record<string, number> = {};
    currentRoom.expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    const catData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(catData);

    // Calculate weekly data (last 7 days)
    const today = new Date();
    const weeklyTotals: Record<string, number> = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      weeklyTotals[dateStr] = 0;
    }

    currentRoom.expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const dateStr = expenseDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (weeklyTotals[dateStr] !== undefined) {
        weeklyTotals[dateStr] += expense.amount;
      }
    });

    const weekData = Object.entries(weeklyTotals).map(([date, amount]) => ({
      date,
      amount,
    }));
    setWeeklyData(weekData);

    // Calculate stats
    const total = currentRoom.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avg = currentRoom.expenses.length > 0 ? total / currentRoom.expenses.length : 0;
    const thisWeek = Object.values(weeklyTotals).reduce((sum, val) => sum + val, 0);

    setStats({
      totalExpenses: total,
      avgExpense: avg,
      totalMembers: currentRoom.members.length,
      thisWeekTotal: thisWeek,
    });
  }, [currentRoom]);

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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Insights and trends for {currentRoom.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-sm opacity-90 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold">${stats.totalExpenses.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-sm opacity-90 mb-1">Avg Expense</p>
            <p className="text-3xl font-bold">${stats.avgExpense.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-sm opacity-90 mb-1">Members</p>
            <p className="text-3xl font-bold">{stats.totalMembers}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-sm opacity-90 mb-1">This Week</p>
            <p className="text-3xl font-bold">${stats.thisWeekTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Pie Chart */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
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
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #FFE0D9",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-20">
                No expenses to display
              </p>
            )}
          </div>

          {/* Weekly Bar Chart */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Weekly Trend</h2>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFE0D9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #FFE0D9",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#FF6B35"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-20">
                No weekly data to display
              </p>
            )}
          </div>
        </div>

        {/* Member Spending Breakdown */}
        <div className="bg-card rounded-3xl p-6 mt-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Member Contributions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentRoom.members.map((member) => {
              const memberTotal = currentRoom.expenses
                .filter((exp) => exp.paidBy === member)
                .reduce((sum, exp) => sum + exp.amount, 0);

              const expenseCount = currentRoom.expenses.filter(
                (exp) => exp.paidBy === member
              ).length;

              return (
                <div
                  key={member}
                  className="bg-muted/30 rounded-2xl p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold">
                      {member[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{member}</p>
                      <p className="text-xs text-muted-foreground">
                        {expenseCount} expenses
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    ${memberTotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
