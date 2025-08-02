"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/hooks/use-toast"
import { caseService } from "@/services/cases"
import { AdminRoute } from "@/components/admin-route"
import { BarChart3, Users, FileText, TrendingUp, Filter } from "lucide-react"

function AdminDashboardContent() {
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAllCases()
  }, [])

  useEffect(() => {
    filterCases()
  }, [cases, typeFilter])

  const fetchAllCases = async () => {
    try {
      const allCases = await caseService.getAllCases()
      setCases(allCases)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cases. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterCases = () => {
    if (typeFilter === "all") {
      setFilteredCases(cases)
    } else {
      setFilteredCases(cases.filter((case_) => case_.type.toLowerCase() === typeFilter))
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getCaseTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "family":
        return "👨‍👩‍👧‍👦"
      case "business":
        return "💼"
      case "criminal":
        return "⚖️"
      default:
        return "📋"
    }
  }

  const getStats = () => {
    const total = cases.length
    const pending = cases.filter((c) => c.status.toLowerCase() === "pending").length
    const inProgress = cases.filter((c) => c.status.toLowerCase() === "in progress").length
    const resolved = cases.filter((c) => c.status.toLowerCase() === "resolved").length
    const family = cases.filter((c) => c.type.toLowerCase() === "family").length
    const business = cases.filter((c) => c.type.toLowerCase() === "business").length
    const criminal = cases.filter((c) => c.type.toLowerCase() === "criminal").length

    return { total, pending, inProgress, resolved, family, business, criminal }
  }

  const groupCasesByStatus = () => {
    const grouped = {
      pending: cases.filter((c) => c.status.toLowerCase() === "pending"),
      "in progress": cases.filter((c) => c.status.toLowerCase() === "in progress"),
      resolved: cases.filter((c) => c.status.toLowerCase() === "resolved"),
    }
    return grouped
  }

  const stats = getStats()
  const groupedCases = groupCasesByStatus()

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage all cases across the platform</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All registered cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active mediation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Case Type Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Cases</CardTitle>
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.family}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Cases</CardTitle>
            <span className="text-2xl">💼</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.business}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criminal Cases</CardTitle>
            <span className="text-2xl">⚖️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criminal}</div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Case Management</CardTitle>
              <CardDescription>View and manage all cases by status</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Filter className="w-4 h-4" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="criminal">Criminal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending ({groupedCases.pending.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({groupedCases["in progress"].length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({groupedCases.resolved.length})</TabsTrigger>
            </TabsList>

            {Object.entries(groupedCases).map(([status, statusCases]) => (
              <TabsContent key={status} value={status === "in progress" ? "in-progress" : status}>
                <div className="space-y-4">
                  {statusCases.filter((case_) => typeFilter === "all" || case_.type.toLowerCase() === typeFilter)
                    .length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No {status} cases found
                      {typeFilter !== "all" && ` for ${typeFilter} type`}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {statusCases
                        .filter((case_) => typeFilter === "all" || case_.type.toLowerCase() === typeFilter)
                        .map((case_) => (
                          <Card key={case_.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <span className="text-xl">{getCaseTypeIcon(case_.type)}</span>
                                  {case_.type}
                                </CardTitle>
                                <Badge className={getStatusColor(case_.status)}>{case_.status}</Badge>
                              </div>
                              <CardDescription>
                                Case #{case_.id} • {new Date(case_.created_at).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium">User:</p>
                                  <p className="text-sm text-muted-foreground">{case_.user_name || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Description:</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{case_.description}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Opposite Party:</p>
                                  <p className="text-sm text-muted-foreground">{case_.opposite_party_name}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  )
}
