import React, { useState, useEffect } from "react";
import { storeApi } from "@/api/store.api";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StarRating } from "@/components/common/StarRating";
import {
  Store,
  Star,
  Users,
  MapPin,
  Mail,
  ArrowUpDown,
  SlidersHorizontal,
  Loader2,
  Calendar,
} from "lucide-react";

export default function OwnerDashboardPage() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { user } = useAuth();

  const fetchOwnerStore = async () => {
    try {
      setLoading(true);
      setError("");
      const params = { sortBy, sortOrder };
      const res = await storeApi.getMyStore(params);
      if (res.success && res.data) {
        setStoreData(res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "No store assigned to your account yet. Please contact the administrator."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerStore();
  }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (loading && !storeData) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !storeData) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <Card className="bg-card border-border text-center py-12">
          <CardContent className="space-y-4">
            <Store className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <h2 className="text-xl font-bold text-foreground">No Store Registered</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { store, averageRating, overallRating, totalRatings, ratings = [] } = storeData || {};

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Store Owner Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your store performance, review feedback ratings, and inspect individual customer reviews.
        </p>
      </div>

      {/* Store Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Store Info */}
        <Card className="bg-card border-border sm:col-span-1">
          <CardHeader className="pb-2">
            <div className="w-8 h-8 rounded-md bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center justify-center mb-1">
              <Store className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-semibold">{store?.name}</CardTitle>
            <CardDescription className="text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" /> {store?.address}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground pt-1 flex items-center gap-1.5 font-mono">
            <Mail className="w-3 h-3" /> {store?.email}
          </CardContent>
        </Card>

        {/* Average Rating Score */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Store Average Rating</CardTitle>
            <div className="w-8 h-8 rounded-md bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {(overallRating || averageRating || 0).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
            <div className="mt-2">
              <StarRating rating={Math.round(overallRating || averageRating || 0)} size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* Total Feedback Count */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Customer Reviews</CardTitle>
            <div className="w-8 h-8 rounded-md bg-blue-950/40 text-blue-400 border border-blue-800/40 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRatings || 0}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Verified user rating submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Ratings Table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">User Ratings & Feedback</CardTitle>
            <CardDescription className="text-xs">
              List of users who rated your store
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Click headers to sort table</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {ratings.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <Star className="w-8 h-8 mx-auto opacity-30 text-amber-400" />
              <p className="text-sm font-medium">No customer ratings yet</p>
              <p className="text-xs">Ratings submitted by users will automatically appear here in real-time.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer hover:text-foreground text-xs font-semibold select-none"
                  >
                    <div className="flex items-center gap-1">
                      Customer Name <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("email")}
                    className="cursor-pointer hover:text-foreground text-xs font-semibold select-none hidden sm:table-cell"
                  >
                    <div className="flex items-center gap-1">
                      Customer Email <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("rating")}
                    className="cursor-pointer hover:text-foreground text-xs font-semibold select-none text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Rating Score <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer hover:text-foreground text-xs font-semibold select-none text-right pr-6"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Date Submitted <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ratings.map((item, idx) => (
                  <TableRow key={idx} className="border-border hover:bg-secondary/20">
                    <TableCell className="font-medium text-foreground py-3 text-xs">
                      {item.user?.name || "Anonymous User"}
                    </TableCell>

                    <TableCell className="text-muted-foreground font-mono text-xs hidden sm:table-cell">
                      {item.user?.email || "—"}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 font-semibold text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating} / 5</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6 text-xs text-muted-foreground">
                      <div className="inline-flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
