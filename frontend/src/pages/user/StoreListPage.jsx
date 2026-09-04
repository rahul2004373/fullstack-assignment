import React, { useState, useEffect } from "react";
import { storeApi } from "@/api/store.api";
import { ratingApi } from "@/api/rating.api";
import { useAuth } from "@/context/AuthContext";
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
  Search,
  ArrowUpDown,
  Store as StoreIcon,
  Star,
  MapPin,
  Mail,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Rating Modal state
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  const { isNormalUser } = useAuth();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = {
        name: searchName || undefined,
        address: searchAddress || undefined,
        sortBy,
        sortOrder,
      };
      const res = await storeApi.getStores(params);
      if (res.success && res.data) {
        setStores(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRatingValue(store.userRating || 5);
    setRatingMessage("");
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    try {
      setSubmittingRating(true);
      setRatingMessage("");
      const res = await ratingApi.submitRating(selectedStore.id, Number(ratingValue));
      if (res.success) {
        setRatingMessage("Rating submitted successfully!");
        setTimeout(() => {
          setSelectedStore(null);
          fetchStores();
        }, 800);
      }
    } catch (err) {
      setRatingMessage(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Registered Stores Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse all stores, view overall ratings, and submit or modify your personal ratings.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search store name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9 bg-background border-border text-sm h-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search by address / city..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="pl-9 bg-background border-border text-sm h-10"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-xs font-medium">
                Apply Search
              </Button>
              {(searchName || searchAddress) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchName("");
                    setSearchAddress("");
                    setTimeout(fetchStores, 0);
                  }}
                  className="border-border text-xs h-10"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Store Listings</CardTitle>
            <CardDescription className="text-xs">
              Showing {stores.length} registered store{stores.length === 1 ? "" : "s"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Click column header to sort</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm">Loading stores directory...</span>
            </div>
          ) : stores.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <StoreIcon className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-sm font-medium">No stores match your search criteria</p>
              <p className="text-xs">Try adjusting your search terms or clearing filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer hover:text-foreground select-none font-semibold text-xs"
                  >
                    <div className="flex items-center gap-1">
                      Store Name
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("email")}
                    className="cursor-pointer hover:text-foreground select-none font-semibold text-xs hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1">
                      Email
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("address")}
                    className="cursor-pointer hover:text-foreground select-none font-semibold text-xs"
                  >
                    <div className="flex items-center gap-1">
                      Address
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("overallRating")}
                    className="cursor-pointer hover:text-foreground select-none font-semibold text-xs text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Overall Rating
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead
                    onClick={() => handleSort("userRating")}
                    className="cursor-pointer hover:text-foreground select-none font-semibold text-xs text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      My Rating
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </TableHead>

                  <TableHead className="text-right font-semibold text-xs pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} className="border-border hover:bg-secondary/20">
                    <TableCell className="font-medium text-foreground py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                          <StoreIcon className="w-3.5 h-3.5" />
                        </div>
                        <span>{store.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs font-mono hidden md:table-cell">
                      {store.email}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                      {store.address}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{store.overallRating > 0 ? store.overallRating.toFixed(1) : "N/A"}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          ({store.totalRatings} review{store.totalRatings === 1 ? "" : "s"})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {store.userRating ? (
                        <div className="inline-flex flex-col items-center">
                          <Badge variant="outline" className="border-amber-900/50 bg-amber-950/30 text-amber-300 gap-1 text-[11px] font-bold">
                            <Star className="w-3 h-3 fill-amber-300" /> {store.userRating} / 5
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600 italic">Not rated</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right pr-4">
                      {isNormalUser ? (
                        <Button
                          size="sm"
                          variant={store.userRating ? "outline" : "default"}
                          onClick={() => openRatingModal(store)}
                          className={`h-8 text-xs font-medium gap-1.5 ${
                            store.userRating
                              ? "border-border hover:bg-secondary text-foreground"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                          {store.userRating ? "Modify Rating" : "Submit Rating"}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Login as User to rate</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Submit / Modify Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl relative">
            <button
              onClick={() => setSelectedStore(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                {selectedStore.userRating ? "Modify Your Rating" : "Rate this Store"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {selectedStore.name} ({selectedStore.address})
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleRatingSubmit}>
              <CardContent className="space-y-4 py-2">
                {ratingMessage && (
                  <div className="p-2.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
                    {ratingMessage}
                  </div>
                )}

                <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-lg border border-border/50 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium">Select your rating (1 to 5 stars)</span>
                  <StarRating
                    rating={ratingValue}
                    interactive={true}
                    size="xl"
                    onRatingChange={(newVal) => setRatingValue(newVal)}
                  />
                  <span className="text-2xl font-bold text-foreground">
                    {ratingValue} <span className="text-sm font-normal text-muted-foreground">/ 5</span>
                  </span>
                </div>
              </CardContent>

              <div className="p-6 pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedStore(null)}
                  className="border-border text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingRating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9 font-medium"
                >
                  {submittingRating ? "Saving..." : selectedStore.userRating ? "Update Rating" : "Submit Rating"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
