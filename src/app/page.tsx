"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Sparkles, TrendingUp, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { addRoom } = useApp();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [memberNames, setMemberNames] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !memberNames) {
      toast.error("Please fill in all fields");
      return;
    }

    const members = memberNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);

    if (members.length < 2) {
      toast.error("Please add at least 2 members");
      return;
    }

    const newRoom = {
      id: `room-${Date.now()}`,
      name: roomName,
      members,
      expenses: [],
      createdAt: new Date().toISOString(),
    };

    addRoom(newRoom);
    toast.success("Room created successfully! 🎉");
    router.push("/dashboard");
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode) {
      toast.error("Please enter a room code");
      return;
    }
    toast.success("Joined room successfully! 🎉");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-sunrise flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Your Friendly Expense Tracker
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            BachelorBuddy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Split expenses, track budgets, and live harmoniously with your
            roommates
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-3xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Room-Based Splitting
            </h3>
            <p className="text-white/80 text-sm">
              Create rooms, invite roommates, and split expenses fairly
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Insights
            </h3>
            <p className="text-white/80 text-sm">
              Get smart spending insights and personalized recommendations
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Visual Analytics
            </h3>
            <p className="text-white/80 text-sm">
              Beautiful charts and graphs to track your spending patterns
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        {!showCreateRoom ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowCreateRoom(true)}
              className="glass-card border-2 border-white/40 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Room
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-all"
            >
              <Users className="w-5 h-5 mr-2" />
              View Demo Room
            </Button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="glass-card rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Create Your Room
              </h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <Label htmlFor="roomName" className="text-white">
                    Room Name
                  </Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., Apartment 4B"
                    className="mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label htmlFor="members" className="text-white">
                    Members (comma-separated)
                  </Label>
                  <Input
                    id="members"
                    value={memberNames}
                    onChange={(e) => setMemberNames(e.target.value)}
                    placeholder="Alex, Jordan, Sam"
                    className="mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-white text-primary hover:bg-white/90"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateRoom(false)}
                    variant="outline"
                    className="flex-1 border-white/40 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}