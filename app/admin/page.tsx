"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ShieldCheck, User, Search, Download, Trash2, Plus, Users, Star, FileText } from "lucide-react";
import { format } from "date-fns";

type UserType = {
  id: string;
  email: string;
  name: string | null;
  isPremium: boolean;
  freeAccess: boolean;
  credits: number;
  createdAt: string;
};

type StatsType = {
  totalUsers: number;
  premiumUsers: number;
  totalCVs: number;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if ((session?.user as any)?.role !== "ADMIN") {
        router.push("/");
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("Failed to fetch admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFreeAccess = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, freeAccess: !currentStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, freeAccess: !currentStatus } : user
          )
        );
        toast.success("User access updated");
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const addCredits = async (userId: string) => {
    const amountStr = prompt("How many credits to add?");
    if (!amountStr) return;
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, creditsToAdd: amount }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, credits: u.credits + amount } : u))
        );
        toast.success(`Added ${amount} credits`);
      } else {
        toast.error("Failed to add credits");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you SURE you want to delete this user and all their CVs? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setStats((prev) => prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : null);
        toast.success("User deleted completely");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    
    const headers = ["ID", "Name", "Email", "Premium", "FreeAccess", "Credits", "Joined"];
    const csvContent = [
      headers.join(","),
      ...users.map(u => 
        \`\${u.id},"\${u.name || ''}","\${u.email}",\${u.isPremium},\${u.freeAccess},\${u.credits},\${new Date(u.createdAt).toISOString()}\`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", \`cvmatch_users_\${format(new Date(), "yyyy-MM-dd")}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if ((session?.user as any)?.role !== "ADMIN") {
    return null;
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage users, credits, and global metrics</p>
          </div>
          <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">CVs Generated</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalCVs}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Premium Users</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.premiumUsers}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Registered Users</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search by email or name..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Joined Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Credits</th>
                    <th className="px-6 py-3 text-center">Free Access</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <div>{user.name || "No Name"}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        {user.isPremium ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Premium</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">Free</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-mono">
                        <div className="flex items-center justify-center gap-2">
                          {user.credits}
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-indigo-600" onClick={() => addCredits(user.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Switch 
                            checked={user.freeAccess}
                            onCheckedChange={() => toggleFreeAccess(user.id, user.freeAccess)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
