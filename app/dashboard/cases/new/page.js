"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { caseService } from "@/services/cases";
import { ProtectedRoute } from "@/components/protected-route";
import { FileText, Upload, ArrowLeft, User, AlertCircle } from "lucide-react";
import { AutocompleteInput } from "@/components/autocomplete-input";
import Link from "next/link";
import { toast } from "sonner";
import { usersService } from "@/services/users";

function NewCaseContent() {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    opposite_party_name: "",
    opposite_party_phone: "",
    opposite_party_address: "",
    opposite_party_email: "",
    is_in_court: false,
    case_or_fir_number: "",
    court_or_police_name: "",
  });

  // Autocomplete state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEmailField, setShowEmailField] = useState(true);
  const [searchError, setSearchError] = useState("");

  const [proofFile, setProofFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  ///////
  const [validationErrors, setValidationErrors] = useState({});
  ////////

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.type ||
      !formData.description ||
      !formData.opposite_party_name ||
      !formData.opposite_party_phone ||
      !formData.opposite_party_address
    ) {
      toast("Missing Required Fields", {
        description: "Please fill in all required fields marked with *.",
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.opposite_party_phone)) {
      toast("Invalid Phone Number", {
        description: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    // validate email field if it shows
    if (showEmailField && formData.opposite_party_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.opposite_party_email)) {
        toast("Please enter a valid email address");
        return;
      }
    }

    // Court-related validation
    if (formData.is_in_court) {
      if (!formData.fir_case_number.trim()) {
        toast("FIR/Case number is required when case is in court");
        return;
      }
      if (!formData.court_police_station.trim()) {
        toast("Court/Police station name is required when case is in court");
        return;
      }
    }

    setIsLoading(true);

    try {
      const submissionData = {
        ...formData,
        // Only include email if it's shown and has a value
        opposite_party_email:
          showEmailField && formData.opposite_party_email.trim()
            ? formData.opposite_party_email.trim()
            : null,
        // Include selected user ID if available
        opposite_party_user_id: selectedUser?.id || null,
      };

      await caseService.createCase(submissionData, proofFile);

      toast("Case registered successfully", {
        description: "Your case has been submitted and is now under review.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast("Registration failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      is_in_court: checked,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast("File too large", {
          description: "Please select a file smaller than 10MB.",
        });
        return;
      }
      setProofFile(file);
    }
  };

  // Autocomplete handlers
  const handleNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      opposite_party_name: value,
    }));

    // Clear validation error
    if (validationErrors.opposite_party_name) {
      setValidationErrors((prev) => ({
        ...prev,
        opposite_party_name: "",
      }));
    }

    setSearchError("");
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowEmailField(false);

    // Auto-fill phone and address
    setFormData((prev) => ({
      ...prev,
      opposite_party_phone: user.phone || "",
      opposite_party_address: user.address || "",
      opposite_party_email: "", // Clear email when user is selected
    }));

    // Clear related validation errors
    setValidationErrors((prev) => ({
      ...prev,
      opposite_party_phone: "",
      opposite_party_address: "",
      opposite_party_email: "",
    }));

    toast("User selected", {
      description: `${user.name}'s information has been auto-filled.`,
    });
  };

  const handleUserClear = () => {
    setSelectedUser(null);
    setShowEmailField(true);

    // Clear auto-filled data but keep the name
    setFormData((prev) => ({
      ...prev,
      opposite_party_phone: "",
      opposite_party_address: "",
      opposite_party_email: "",
    }));
  };

  const searchUsers = async (query) => {
    try {
      setSearchError("");
      const results = await usersService.searchUsers(query);``
      return results;
    } catch (error) {
      setSearchError(
        "Failed to search users. Please try typing the name manually."
      );
      return [];
    }
  };

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
          <h1 className="text-3xl font-bold">Register New Case</h1>
          <p className="text-muted-foreground">
            Submit your dispute for mediation
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Case Registration Form
          </CardTitle>
          <CardDescription>
            Please provide detailed information about your dispute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Case Information</h3>

              <div className="space-y-2">
                <Label htmlFor="type">Case Type *</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Case Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  // required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of your dispute..."
                />
              </div>
            </div>

            {/* Opposite Party Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Opposite Party Information
              </h3>

              {searchError && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="opposite_party_name">Name *</Label>
                <AutocompleteInput
                  value={formData.opposite_party_name}
                  onChange={handleNameChange}
                  onSelect={handleUserSelect}
                  onClear={handleUserClear}
                  searchFunction={searchUsers}
                  placeholder="Start typing to search existing users or enter manually..."
                  displayField="name"
                  className={
                    validationErrors.opposite_party_name ? "border-red-500" : ""
                  }
                />
                {validationErrors.opposite_party_name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.opposite_party_name}
                  </p>
                )}
                {selectedUser && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <User className="w-4 h-4" />
                    <span>
                      Existing user selected - contact details auto-filled
                    </span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opposite_party_phone">Phone Number *</Label>
                  <Input
                    id="opposite_party_phone"
                    name="opposite_party_phone"
                    type="tel"
                    required
                    value={formData.opposite_party_phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={
                      validationErrors.opposite_party_phone
                        ? "border-red-500"
                        : ""
                    }
                    disabled={selectedUser !== null}
                  />
                  {validationErrors.opposite_party_phone && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.opposite_party_phone}
                    </p>
                  )}
                </div>

                {showEmailField && (
                  <div className="space-y-2">
                    <Label htmlFor="opposite_party_email">Email Address</Label>
                    <Input
                      id="opposite_party_email"
                      name="opposite_party_email"
                      type="email"
                      value={formData.opposite_party_email}
                      onChange={handleChange}
                      placeholder="Enter email (optional)"
                      className={
                        validationErrors.opposite_party_email
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {validationErrors.opposite_party_email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.opposite_party_email}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Email will be used to invite the opposite party to the
                      platform
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="opposite_party_address">Address *</Label>
                <Textarea
                  id="opposite_party_address"
                  name="opposite_party_address"
                  required
                  rows={2}
                  value={formData.opposite_party_address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  className={
                    validationErrors.opposite_party_address
                      ? "border-red-500"
                      : ""
                  }
                  disabled={selectedUser !== null}
                />
                {validationErrors.opposite_party_address && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.opposite_party_address}
                  </p>
                )}
              </div>
            </div>

            {/* Legal Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal Status</h3>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_in_court"
                  checked={formData.is_in_court}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_in_court">
                  Is this case currently in court?
                </Label>
              </div>

              {formData.is_in_court && (
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="case_or_fir_number">FIR/Case Number</Label>
                    <Input
                      id="case_or_fir_number"
                      name="case_or_fir_number"
                      value={formData.case_or_fir_number}
                      onChange={handleChange}
                      placeholder="Enter FIR or case number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court_or_police_name">
                      Court/Police Station Name
                    </Label>
                    <Input
                      id="court_or_police_name"
                      name="court_or_police_name"
                      value={formData.court_or_police_name}
                      onChange={handleChange}
                      placeholder="Enter court or police station name"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporting Evidence</h3>

              <div className="space-y-2">
                <Label htmlFor="proof">Upload Proof (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="proof"
                    type="file"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: Images, Videos, Audio files, PDF, Word
                  documents (Max 10MB)
                </p>
                {proofFile && (
                  <p className="text-sm text-green-600">
                    Selected: {proofFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Registering Case..." : "Register Case"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewCasePage() {
  return (
    <ProtectedRoute>
      <NewCaseContent />
    </ProtectedRoute>
  );
}
