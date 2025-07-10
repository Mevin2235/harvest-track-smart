
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wheat, Plus, Eye, LogOut, Package, MapPin, Calendar, Scale } from "lucide-react";
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
  weight?: number;
  temperature?: number;
  humidity?: number;
  storageStartDate?: string;
  submittedDate: string;
}

const FarmerDashboard = () => {
  const [batches, setBatches] = useState<CropBatch[]>([]);
  const [newBatch, setNewBatch] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    harvestDate: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Farmer";

  useEffect(() => {
    // Load existing batches from localStorage
    const savedBatches = localStorage.getItem("cropBatches");
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }
  }, []);

  const handleSubmitBatch = () => {
    if (!newBatch.cropName || !newBatch.quantity || !newBatch.harvestDate || !newBatch.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const batch: CropBatch = {
      id: `batch-${Date.now()}`,
      cropName: newBatch.cropName,
      quantity: parseInt(newBatch.quantity),
      unit: newBatch.unit,
      harvestDate: newBatch.harvestDate,
      location: newBatch.location,
      status: "Pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };

    const updatedBatches = [...batches, batch];
    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));

    setNewBatch({
      cropName: "",
      quantity: "",
      unit: "kg",
      harvestDate: "",
      location: "",
    });

    setIsSubmitting(false);

    toast({
      title: "Batch Submitted Successfully",
      description: "Your crop batch has been submitted for review",
    });
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

  const stats = {
    total: batches.length,
    pending: batches.filter((b) => b.status === "Pending").length,
    approved: batches.filter((b) => b.status === "Approved").length,
    rejected: batches.filter((b) => b.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Wheat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">AgriPost</h1>
                <p className="text-sm text-green-600">Farmer Dashboard</p>
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
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
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
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit New Batch */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-green-600" />
                <span>Submit New Batch</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Input
                  id="cropName"
                  placeholder="e.g., Rice, Wheat, Corn"
                  value={newBatch.cropName}
                  onChange={(e) => setNewBatch({ ...newBatch, cropName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1000"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newBatch.unit}
                    onChange={(e) => setNewBatch({ ...newBatch, unit: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="bags">bags</option>
                    <option value="quintals">quintals</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={newBatch.harvestDate}
                  onChange={(e) => setNewBatch({ ...newBatch, harvestDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Farm location/address"
                  value={newBatch.location}
                  onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })}
                />
              </div>

              <Button
                onClick={handleSubmitBatch}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Batch"}
              </Button>
            </CardContent>
          </Card>

          {/* Batch List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Crop Batches</CardTitle>
            </CardHeader>
            <CardContent>
              {batches.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No batches submitted yet</p>
                  <p className="text-sm text-gray-400">Submit your first crop batch to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.map((batch) => (
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

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Harvested: {batch.harvestDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{batch.location}</span>
                        </div>
                      </div>

                      {batch.status === "Approved" && (
                        <div className="bg-green-50 p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {batch.grade && (
                              <div className="flex items-center space-x-2">
                                <Scale className="h-4 w-4 text-green-600" />
                                <span>Grade: {batch.grade}</span>
                              </div>
                            )}
                            {batch.packagingType && (
                              <div>
                                <span className="font-medium">Packaging:</span> {batch.packagingType}
                              </div>
                            )}
                            {batch.weight && (
                              <div>
                                <span className="font-medium">Weight:</span> {batch.weight} kg
                              </div>
                            )}
                            {batch.temperature && (
                              <div>
                                <span className="font-medium">Storage Temp:</span> {batch.temperature}°C
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
