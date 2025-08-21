"use client";

import React, { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { caseService } from "@/services/cases";
import { ProtectedRoute } from "@/components/protected-route";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "@/lib/utils";
import { authService } from "@/services/auth";
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Check,
  Loader2,
  UserCheck,
  X,
} from "lucide-react";

function CaseDetailsContent({ params }) {
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [caseStatus, setCaseStatus] = useState("pending");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(false);

  const router = useRouter();

  const resolvedParams = React.use(params);

  useEffect(() => {
    fetchCaseDetails();
  }, [resolvedParams.id]);

  const currentUser = authService.getCurrentUser();

  const fetchCaseDetails = async () => {
    try {
      const case_ = await caseService.getCaseById(resolvedParams.id);
      setCaseData(case_);

      // Calculate status after we have the case data
      let userStatus = "pending";
      if (case_ && currentUser) {
        if (case_.user_id === currentUser.id) {
          userStatus = case_.creator_status;
        } else if (case_.opposite_party_user_id === currentUser.id) {
          userStatus = case_.opposite_party_status;
          if (case_.opposite_party_status === "requested") {
            setShowAcceptButton(true);
          }
        }
      }

      setCaseStatus(userStatus);
    } catch (error) {
      toast("Error", {
        description: "Failed to fetch case details. Please try again.",
      });
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

const handleCaseResponse = async (action) => {
  if (!caseData || !currentUser) return;

  const setLoading = action === 'accept' ? setIsAccepting : setIsRejecting;
  setLoading(true);

  try {
    const updatedCase = action === 'accept' 
      ? await caseService.acceptCase(caseData.id)
      : await caseService.rejectCase(caseData.id);

    setCaseData(updatedCase);
    setShowAcceptButton(false);

    toast({
      title: `Case ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
      description: `You have ${action === 'accept' ? 'accepted' : 'declined'} this mediation case. The case initiator will be notified.`,
    });
  } catch (error) {
    toast({
      title: `Failed to ${action === 'accept' ? 'Accept' : 'Reject'} Case`,
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  // check if the current user is the opposite party and if their status is "requested"
  // const shouldShowAcceptButton = async () => {
  //   if (!caseData || !currentUser) {
  //     setHasResponded;
  //     return;
  //   }

  //   const isOppositeParty = caseData.opposite_party_user_id === currentUser.id;
  //   const isRequestedStatus =
  //     caseData.opposite_party_status?.toLowerCase() === "requested";

  //   return isOppositeParty && isRequestedStatus;
  // };

  // shouldShowAcceptButton();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Case Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested case could not be found.
            </p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Case Details</h1>
          <p className="text-muted-foreground">Case #{caseData.id}</p>
        </div>
      </div>
      {/* Accept Case Alert for Opposite Party */}
      {showAcceptButton && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <UserCheck className="h-4 w-4 text-blue-600 mt-2" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <div className="flex items-center justify-between">
              <span>
                You have been invited to participate in this mediation case.
              </span>
              <Button
                onClick={handleCaseResponse.bind(null, 'accept')}
                disabled={isAccepting || isRejecting}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Accept Case
                  </>
                )}
              </Button>
              <Button
                onClick={handleCaseResponse.bind(null, 'reject')}
                disabled={isAccepting || isRejecting}
                className="ml-4 bg-red-600 hover:bg-blue-700 text-white"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Case
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">
                    {getCaseTypeIcon(caseData.type)}
                  </span>
                  <div>
                    <h2 className="text-xl">{caseData.type} Case</h2>
                    <CardDescription>
                      Registered on {formatDate(caseData.created_at)}
                    </CardDescription>
                  </div>
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    caseStatus
                  )} flex items-center gap-1`}
                >
                  {getStatusIcon(caseStatus)}
                  {caseStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Case Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {caseData.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opposite Party Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Opposite Party Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {caseData.opposite_party_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {caseData.opposite_party_phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {caseData.opposite_party_address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Status */}
          {caseData.is_in_court && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Legal Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">In Court</Badge>
                    <span className="text-muted-foreground">
                      This case is currently in legal proceedings
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {caseData.case_or_fir_number && (
                      <div>
                        <p className="text-sm font-medium">FIR/Case Number</p>
                        <p className="text-sm text-muted-foreground">
                          {caseData.case_or_fir_number}
                        </p>
                      </div>
                    )}
                    {caseData.court_or_police_name && (
                      <div>
                        <p className="text-sm font-medium">
                          Court/Police Station
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {caseData.court_or_police_name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evidence */}
          {caseData.proof_file && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Supporting Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Evidence File</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {formatDate(caseData.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Case Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Case Registered</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(caseData.created_at)}
                    </p>
                  </div>
                </div>
                {caseStatus.toLowerCase() !== "pending" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Under Review</p>
                      <p className="text-xs text-muted-foreground">
                        Case assigned to mediator
                      </p>
                    </div>
                  </div>
                )}
                {caseStatus.toLowerCase() === "resolved" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Case Resolved</p>
                      <p className="text-xs text-muted-foreground">
                        Agreement reached
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Download Case Summary
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <User className="w-4 h-4 mr-2" />
                Contact Mediator
              </Button>
              {caseStatus.toLowerCase() === "resolved" && (
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Agreement
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Case Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Case ID</span>
                <span className="font-medium">#{caseData.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{caseData.type}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={getStatusColor(caseStatus)}
                  variant="secondary"
                >
                  {caseStatus}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {formatDate(caseData.created_at)}
                </span>
              </div>
              {caseData.updated_at &&
                caseData.updated_at !== caseData.created_at && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Last Updated
                      </span>
                      <span className="font-medium">
                        {formatDate(caseData.updated_at)}
                      </span>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CaseDetailsPage({ params }) {
  return (
    <ProtectedRoute>
      <CaseDetailsContent params={params} />
    </ProtectedRoute>
  );
}
