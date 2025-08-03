"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { caseService } from "@/services/cases";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { ProtectedRoute } from "@/components/protected-route";
import { Plus, FileText, Calendar, Filter, Eye } from "lucide-react";

function DashboardContent() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchCases();
    }
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, statusFilter]);

  const getUserCaseStatus = (case_) => {
    if (user?.id === case_.user_id) {
      return case_.creator_status;
    } else if (user?.id === case_.opposite_party_user_id) {
      return case_.opposite_party_status;
    }
    return "unknown";
  };

  const fetchCases = async () => {
    try {
      const userCases = await caseService.getUserCases();
      setCases(userCases.cases);
    } catch (error) {
      toast("Error", {
        description: "Failed to fetch cases. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCases = () => {
    if (statusFilter === "all") {
      setFilteredCases(cases);
    } else {
      setFilteredCases(
        cases.filter(
          (case_) => getUserCaseStatus(case_).toLowerCase() === statusFilter
        )
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCaseTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "family":
        return "👨‍👩‍👧‍👦";
      case "business":
        return "💼";
      case "criminal":
        return "⚖️";
      default:
        return "📋";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Manage your cases and track their progress
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/cases/new">
            <Plus className="w-4 h-4 mr-2" />
            Register New Case
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                cases.filter(
                  (c) => getUserCaseStatus(c).toLowerCase() === "pending"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                cases.filter(
                  (c) => getUserCaseStatus(c).toLowerCase() === "in progress"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                cases.filter(
                  (c) => getUserCaseStatus(c).toLowerCase() === "pending"
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-4 h-4" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cases</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cases found</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all"
                ? "You haven't registered any cases yet."
                : `No ${statusFilter} cases found.`}
            </p>
            <Button asChild>
              <Link href="/dashboard/cases/new">Register Your First Case</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((case_) => (
            <Card key={case_.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">
                      {getCaseTypeIcon(case_.type)}
                    </span>
                    {case_.type}
                  </CardTitle>
                  <Badge className={getStatusColor(getUserCaseStatus(case_))}>
                    {getUserCaseStatus(case_)}
                  </Badge>
                </div>
                <CardDescription>
                  Case #{case_.id} • Created{" "}
                  {new Date(case_.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {case_.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Opposite Party:</p>
                    <p className="text-sm text-muted-foreground">
                      {case_.opposite_party_name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push(`/dashboard/cases/${case_.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
