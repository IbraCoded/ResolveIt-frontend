"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"

export function CaseStatusTracker({ status, createdAt, updatedAt }) {
  const getStatusProgress = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 25
      case "under review":
        return 50
      case "in progress":
        return 75
      case "resolved":
        return 100
      default:
        return 0
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "under review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "under review":
        return <FileText className="w-4 h-4" />
      case "in progress":
        return <AlertCircle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const statusSteps = [
    { name: "Submitted", status: "pending" },
    { name: "Under Review", status: "under review" },
    { name: "In Progress", status: "in progress" },
    { name: "Resolved", status: "resolved" },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.status.toLowerCase() === status.toLowerCase())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Case Progress</span>
          <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
            {getStatusIcon(status)}
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{getStatusProgress(status)}%</span>
          </div>
          <Progress value={getStatusProgress(status)} className="h-2" />
        </div>

        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.name} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCurrent ? "text-blue-600" : ""}`}>{step.name}</p>
                  {isCurrent && <p className="text-sm text-muted-foreground">Current status</p>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
