
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Package, CheckCircle, XCircle, LogOut, Thermometer, Droplets, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface CropBatch {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  location: string;
  status: "Pending" | "Approved" | "Rejected";
  grade?: "A" | "B" | "C";
  packagingType?: string;
  units?: number;
  weight?: number;
  temperature?: number;
  humidity?: number;
  storageStartDate?: string;
  submittedDate: string;
  rejectionReason?: string;
}

const AdminDashboard = () => {
  const [batches, setBatches] = useState<CropBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<CropBatch | null>(null);
  const [gradingData, setGradingData] = useState({
    grade: "A",
    packagingType: "",
    units: "",
    weight: "",
  });
  const [storageData, setStorageData] = useState({
    temperature: "",
    humidity: "",
    storageStartDate: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    // Load existing batches from localStorage
    const savedBatches = localStorage.getItem("cropBatches");
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }
  }, []);

  const handleGradingSubmit = () => {
    if (!selectedBatch) return;

    if (!gradingData.packagingType || !gradingData.units || !gradingData.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all grading details",
        variant: "destructive",
      });
      return;
    }

    const updatedBatch = {
      ...selectedBatch,
      grade: gradingData.grade as "A" | "B" | "C",
      packagingType: gradingData.packagingType,
      units: parseInt(gradingData.units),
      weight: parseFloat(gradingData.weight),
    };

    const updatedBatches = batches.map((batch) =>
      batch.id === selectedBatch.id ? updatedBatch : batch
    );

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));
    setSelectedBatch(updatedBatch);

    setGradingData({
      grade: "A",
      packagingType: "",
      units: "",
      weight: "",
    });

    toast({
      title: "Grading Updated",
      description: "Grading details have been saved successfully",
    });
  };

  const handleStorageSubmit = () => {
    if (!selectedBatch) return;

    if (!storageData.temperature || !storageData.humidity || !storageData.storageStartDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all storage details",
        variant: "destructive",
      });
      return;
    }

    const updatedBatch = {
      ...selectedBatch,
      temperature: parseFloat(storageData.temperature),
      humidity: parseFloat(storageData.humidity),
      storageStartDate: storageData.storageStartDate,
    };

    const updatedBatches = batches.map((batch) =>
      batch.id === selectedBatch.id ? updatedBatch : batch
    );

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));
    setSelectedBatch(updatedBatch);

    setStorageData({
      temperature: "",
      humidity: "",
      storageStartDate: "",
    });

    toast({
      title: "Storage Updated",
      description: "Storage conditions have been recorded successfully",
    });
  };

  const handleApproval = (batchId: string, approved: boolean) => {
    setIsProcessing(true);

    const updatedBatches = batches.map((batch) => {
      if (batch.id === batchId) {
        return {
          ...batch,
          status: approved ? "Approved" as const : "Rejected" as const,
          rejectionReason: approved ? undefined : rejectionReason,
        };
      }
      return batch;
    });

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));

    toast({
      title: approved ? "Batch Approved" : "Batch Rejected",
      description: approved 
        ? "The batch has been approved and farmer notified"
        : "The batch has been rejected with reason provided",
    });

    setIsProcessing(false);
    setRejectionReason("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const pendingBatches = batches.filter((b) => b.status === "Pending");
  const processedBatches = batches.filter((b) => b.status !== "Pending");

  const stats = {
    total: batches.length,
    pending: batches.filter((b) => b.status === "Pending").length,
    approved: batches.filter((b) => b.status === "Approved").length,
    rejected: batches.filter((b) => b.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-800">AgriPost</h1>
                <p className="text-sm text-blue-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {username}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Batches</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Batches */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-yellow-600" />
                <span>Pending Batches ({pendingBatches.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBatches.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending batches</p>
                  <p className="text-sm text-gray-400">All batches have been processed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBatches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{batch.cropName}</h3>
                          <p className="text-sm text-gray-600">
                            {batch.quantity} {batch.unit} • Submitted {batch.submittedDate}
                          </p>
                        </div>
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Harvest Date:</span> {batch.harvestDate}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {batch.location}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedBatch(batch)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Grade & Store
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Grade and Storage - {batch.cropName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Grading Section */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Grading Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Grade</Label>
                                    <select
                                      className="w-full p-2 border rounded-md"
                                      value={gradingData.grade}
                                      onChange={(e) => setGradingData({ ...gradingData, grade: e.target.value })}
                                    >
                                      <option value="A">Grade A (Premium)</option>
                                      <option value="B">Grade B (Standard)</option>
                                      <option value="C">Grade C (Basic)</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Packaging Type</Label>
                                    <Input
                                      placeholder="e.g., Jute Bags, Plastic Containers"
                                      value={gradingData.packagingType}
                                      onChange={(e) => setGradingData({ ...gradingData, packagingType: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Units</Label>
                                    <Input
                                      type="number"
                                      placeholder="Number of packages"
                                      value={gradingData.units}
                                      onChange={(e) => setGradingData({ ...gradingData, units: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Total Weight (kg)</Label>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="Total weight"
                                      value={gradingData.weight}
                                      onChange={(e) => setGradingData({ ...gradingData, weight: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <Button onClick={handleGradingSubmit} className="w-full">
                                  Save Grading Details
                                </Button>
                              </div>

                              {/* Storage Section */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Storage Conditions</h3>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label>Temperature (°C)</Label>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="e.g., 25.5"
                                      value={storageData.temperature}
                                      onChange={(e) => setStorageData({ ...storageData, temperature: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Humidity (%)</Label>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="e.g., 60.0"
                                      value={storageData.humidity}
                                      onChange={(e) => setStorageData({ ...storageData, humidity: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Storage Start Date</Label>
                                    <Input
                                      type="date"
                                      value={storageData.storageStartDate}
                                      onChange={(e) => setStorageData({ ...storageData, storageStartDate: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <Button onClick={handleStorageSubmit} className="w-full">
                                  Record Storage Conditions
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => handleApproval(batch.id, true)}
                          disabled={isProcessing}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Batch - {batch.cropName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Rejection Reason</Label>
                                <Textarea
                                  placeholder="Please provide a reason for rejection..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleApproval(batch.id, false)}
                                  disabled={!rejectionReason.trim() || isProcessing}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  Confirm Rejection
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processed Batches Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Processed</CardTitle>
            </CardHeader>
            <CardContent>
              {processedBatches.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No processed batches</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {processedBatches.slice(0, 5).map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{batch.cropName}</p>
                        <p className="text-xs text-gray-600">{batch.quantity} {batch.unit}</p>
                      </div>
                      <Badge className={getStatusColor(batch.status)} variant="outline">
                        {batch.status}
                      </Badge>
                    </div>
                  ))}
                  {processedBatches.length > 5 && (
                    <p className="text-xs text-center text-gray-500 pt-2">
                      +{processedBatches.length - 5} more batches
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
