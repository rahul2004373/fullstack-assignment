import React, { useState, useEffect } from "react";
import { adminApi } from "@/api/admin.api";
import { storeApi } from "@/api/store.api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  // User filters & sorting
  const [userSearchName, setUserSearchName] = useState("");
  const [userSearchEmail, setUserSearchEmail] = useState("");
  const [userSearchAddress, setUserSearchAddress] = useState("");
  const [userFilterRole, setUserFilterRole] = useState("");
  const [userSortBy, setUserSortBy] = useState("name");
  const [userSortOrder, setUserSortOrder] = useState("asc");

  // Store filters & sorting
  const [storeSearchName, setStoreSearchName] = useState("");
  const [storeSearchEmail, setStoreSearchEmail] = useState("");
  const [storeSearchAddress, setStoreSearchAddress] = useState("");
  const [storeSortBy, setStoreSortBy] = useState("name");
  const [storeSortOrder, setStoreSortOrder] = useState("asc");

  // Active view tab
  const [activeTab, setActiveTab] = useState("users"); // "users" or "stores"

  // Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normal_user",
  });

  // New Store Form State
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await adminApi.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const params = {
        name: userSearchName || undefined,
        email: userSearchEmail || undefined,
        address: userSearchAddress || undefined,
        role: userFilterRole || undefined,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
      };
      const res = await adminApi.getUsers(params);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      const params = {
        name: storeSearchName || undefined,
        email: storeSearchEmail || undefined,
        address: storeSearchAddress || undefined,
        sortBy: storeSortBy,
        sortOrder: storeSortOrder,
      };
      const res = await storeApi.getStores(params);
      if (res.success && res.data) {
        setStores(res.data);
      }
    } catch (err) {
      console.error("Failed to load stores:", err);
    } finally {
      setLoadingStores(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSortBy, userSortOrder, userFilterRole]);

  useEffect(() => {
    fetchStores();
  }, [storeSortBy, storeSortOrder]);

  const handleUserSort = (field) => {
    if (userSortBy === field) {
      setUserSortOrder(userSortOrder === "asc" ? "desc" : "asc");
    } else {
      setUserSortBy(field);
      setUserSortOrder("asc");
    }
  };

  const handleStoreSort = (field) => {
    if (storeSortBy === field) {
      setStoreSortOrder(storeSortOrder === "asc" ? "desc" : "asc");
    } else {
      setStoreSortBy(field);
      setStoreSortOrder("asc");
    }
  };

  // Submit Add User
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (newUser.name.length < 20 || newUser.name.length > 60) {
      setModalError("Name must be between 20 and 60 characters");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(newUser.password)) {
      setModalError("Password must be 8-16 chars with at least 1 uppercase and 1 special char");
      return;
    }

    try {
      setModalLoading(true);
      const res = await adminApi.createUser(newUser);
      if (res.success) {
        setModalSuccess("User created successfully!");
        setNewUser({ name: "", email: "", password: "", address: "", role: "normal_user" });
        setTimeout(() => {
          setShowAddUserModal(false);
          setModalSuccess("");
          fetchUsers();
          fetchStats();
        }, 800);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || "Failed to create user");
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Add Store
  const handleAddStoreSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (newStore.name.length < 20 || newStore.name.length > 60) {
      setModalError("Store name must be between 20 and 60 characters");
      return;
    }

    if (!newStore.ownerId) {
      setModalError("Please select a Store Owner");
      return;
    }

    try {
      setModalLoading(true);
      const res = await storeApi.createStore(newStore);
      if (res.success) {
        setModalSuccess("Store created successfully!");
        setNewStore({ name: "", email: "", address: "", ownerId: "" });
        setTimeout(() => {
          setShowAddStoreModal(false);
          setModalSuccess("");
          fetchStores();
          fetchStats();
        }, 800);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || "Failed to create store");
    } finally {
      setModalLoading(false);
    }
  };

  // Filter store owners for the dropdown
  const storeOwnersList = users.filter((u) => u.role === "store_owner");

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            System Administrator Console
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform metrics overview, complete user management, and store directory control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setModalError("");
              setModalSuccess("");
              setShowAddUserModal(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-9 gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setModalError("");
              setModalSuccess("");
              fetchUsers(); // ensure store owners are fresh
              setShowAddStoreModal(true);
            }}
            className="border-border text-foreground hover:bg-secondary text-xs font-medium h-9 gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Store
          </Button>
        </div>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Registered Users</CardTitle>
            <div className="w-8 h-8 rounded-md bg-blue-950/40 text-blue-400 border border-blue-800/40 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalUsers}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Administrators, store owners & consumers</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Registered Stores</CardTitle>
            <div className="w-8 h-8 rounded-md bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalStores}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Active retail stores on the platform</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Ratings Submitted</CardTitle>
            <div className="w-8 h-8 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalRatings}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Feedback reviews recorded (1 to 5 stars)</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs (Users vs Stores) */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
            activeTab === "users"
              ? "bg-secondary text-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          Users Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("stores")}
          className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
            activeTab === "stores"
              ? "bg-secondary text-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          }`}
        >
          Stores Management ({stores.length})
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* User Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 sm:p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchUsers();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
              >
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Filter by name..."
                    value={userSearchName}
                    onChange={(e) => setUserSearchName(e.target.value)}
                    className="pl-8 text-xs h-9 bg-background border-border"
                  />
                </div>

                <Input
                  placeholder="Filter by email..."
                  value={userSearchEmail}
                  onChange={(e) => setUserSearchEmail(e.target.value)}
                  className="text-xs h-9 bg-background border-border"
                />

                <Input
                  placeholder="Filter by address..."
                  value={userSearchAddress}
                  onChange={(e) => setUserSearchAddress(e.target.value)}
                  className="text-xs h-9 bg-background border-border"
                />

                <select
                  value={userFilterRole}
                  onChange={(e) => setUserFilterRole(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 text-xs h-9 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">All Roles</option>
                  <option value="system_admin">System Admin</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="normal_user">Normal User</option>
                </select>
              </form>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="py-16 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground text-xs">
                  No users found matching filter criteria.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead
                        onClick={() => handleUserSort("name")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Name <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleUserSort("email")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Email <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleUserSort("address")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Address <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleUserSort("role")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Role <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleUserSort("rating")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none text-right pr-6"
                      >
                        <div className="flex items-center justify-end gap-1">
                          Store Rating <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="border-border hover:bg-secondary/20">
                        <TableCell className="font-medium text-foreground py-3 text-xs">
                          {u.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {u.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                          {u.address}
                        </TableCell>
                        <TableCell>
                          {u.role === "system_admin" && (
                            <Badge variant="outline" className="border-red-900/40 bg-red-950/30 text-red-300 text-[10px]">
                              Admin
                            </Badge>
                          )}
                          {u.role === "store_owner" && (
                            <Badge variant="outline" className="border-amber-900/40 bg-amber-950/30 text-amber-300 text-[10px]">
                              Store Owner
                            </Badge>
                          )}
                          {u.role === "normal_user" && (
                            <Badge variant="outline" className="border-emerald-900/40 bg-emerald-950/30 text-emerald-300 text-[10px]">
                              Normal User
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6 text-xs">
                          {u.role === "store_owner" ? (
                            u.rating !== null ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                                <Star className="w-3 h-3 fill-amber-400" /> {u.rating} / 5
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-[11px] italic">No store/ratings</span>
                            )
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: STORES MANAGEMENT */}
      {activeTab === "stores" && (
        <div className="space-y-4">
          {/* Store Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 sm:p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchStores();
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Filter by store name..."
                    value={storeSearchName}
                    onChange={(e) => setStoreSearchName(e.target.value)}
                    className="pl-8 text-xs h-9 bg-background border-border"
                  />
                </div>

                <Input
                  placeholder="Filter by store email..."
                  value={storeSearchEmail}
                  onChange={(e) => setStoreSearchEmail(e.target.value)}
                  className="text-xs h-9 bg-background border-border"
                />

                <Input
                  placeholder="Filter by address..."
                  value={storeSearchAddress}
                  onChange={(e) => setStoreSearchAddress(e.target.value)}
                  className="text-xs h-9 bg-background border-border"
                />
              </form>
            </CardContent>
          </Card>

          {/* Stores Table */}
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              {loadingStores ? (
                <div className="py-16 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : stores.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground text-xs">
                  No stores found matching filter criteria.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead
                        onClick={() => handleStoreSort("name")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Store Name <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleStoreSort("email")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Email <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleStoreSort("address")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                      >
                        <div className="flex items-center gap-1">
                          Address <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>

                      <TableHead
                        onClick={() => handleStoreSort("overallRating")}
                        className="cursor-pointer hover:text-foreground text-xs font-semibold select-none text-right pr-6"
                      >
                        <div className="flex items-center justify-end gap-1">
                          Average Rating <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {stores.map((s) => (
                      <TableRow key={s.id} className="border-border hover:bg-secondary/20">
                        <TableCell className="font-medium text-foreground py-3 text-xs">
                          {s.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {s.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                          {s.address}
                        </TableCell>
                        <TableCell className="text-right pr-6 text-xs">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" /> {s.overallRating > 0 ? s.overallRating.toFixed(1) : "0.0"}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1">({s.totalRatings})</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL 1: ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Add New User</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Create a new administrator, store owner, or normal user
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleAddUserSubmit}>
              <CardContent className="space-y-3 pt-0">
                {modalError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}
                {modalSuccess && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{modalSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs">Full Name</Label>
                    <span className="text-[10px] text-muted-foreground">20-60 chars</span>
                  </div>
                  <Input
                    placeholder="e.g. Richard Hendricks Senior"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="richard@piedpiper.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs">Password</Label>
                    <span className="text-[10px] text-muted-foreground">8-16 chars, 1 upper, 1 special</span>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Address</Label>
                  <Input
                    placeholder="5230 Newell Rd, Palo Alto, CA"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-background border border-border rounded-md px-3 text-xs h-9 text-foreground focus:outline-none"
                  >
                    <option value="normal_user">Normal User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="system_admin">System Administrator</option>
                  </select>
                </div>
              </CardContent>

              <div className="p-6 pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddUserModal(false)}
                  className="border-border text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9 font-medium"
                >
                  {modalLoading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: ADD STORE MODAL */}
      {showAddStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl relative">
            <button
              onClick={() => setShowAddStoreModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Add New Store</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Register a new retail store and assign it to a Store Owner
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleAddStoreSubmit}>
              <CardContent className="space-y-3 pt-0">
                {modalError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}
                {modalSuccess && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{modalSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs">Store Name</Label>
                    <span className="text-[10px] text-muted-foreground">20-60 chars</span>
                  </div>
                  <Input
                    placeholder="e.g. Organic Mart Mega Outlet"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Store Email</Label>
                  <Input
                    type="email"
                    placeholder="contact@organicmart.com"
                    value={newStore.email}
                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Store Address</Label>
                  <Input
                    placeholder="450 Enterprise Way, Industrial Park"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    required
                    className="text-xs h-9 bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Store Owner</Label>
                  {storeOwnersList.length === 0 ? (
                    <p className="text-[11px] text-amber-400 bg-amber-950/30 p-2 rounded border border-amber-900/30">
                      No users with role "Store Owner" found. Please create a Store Owner user first!
                    </p>
                  ) : (
                    <select
                      value={newStore.ownerId}
                      onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                      required
                      className="w-full bg-background border border-border rounded-md px-3 text-xs h-9 text-foreground focus:outline-none"
                    >
                      <option value="">-- Select Store Owner --</option>
                      {storeOwnersList.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </CardContent>

              <div className="p-6 pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddStoreModal(false)}
                  className="border-border text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading || storeOwnersList.length === 0}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9 font-medium"
                >
                  {modalLoading ? "Creating..." : "Create Store"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
