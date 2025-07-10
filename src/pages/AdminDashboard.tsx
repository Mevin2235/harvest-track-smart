
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Eye, 
  LogOut, 
  Package, 
  Check, 
  X, 
  Users, 
  Wheat,
  User
} from "lucide-react";
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
  farmerId: string;
  farmerName: string;
}

const AdminDashboard = () => {
  const [batches, setBatches] = useState<CropBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<CropBatch | null>(null);
  const [gradingData, setGradingData] = useState({
    grade: "",
    packagingType: "",
    weight: "",
    temperature: "",
    humidity: "",
    storageStartDate: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    loadAllBatches();
  }, []);

  const loadAllBatches = () => {
    const savedBatches = localStorage.getItem("cropBatches");
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }
  };

  const handleProcessBatch = (batch: CropBatch) => {
    setSelectedBatch(batch);
    // Pre-fill existing data if available
    setGradingData({
      grade: batch.grade || "",
      packagingType: batch.packagingType || "",
      weight: batch.weight?.toString() || "",
      temperature: batch.temperature?.toString() || "",
      humidity: batch.humidity?.toString() || "",
      storageStartDate: batch.storageStartDate || "",
    });
  };

  const handleApproveBatch = () => {
    if (!selectedBatch) return;

    if (!gradingData.grade || !gradingData.packagingType || !gradingData.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in Grade, Packaging Type, and Weight",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const updatedBatch: CropBatch = {
      ...selectedBatch,
      status: "Approved",
      grade: gradingData.grade as "A" | "B" | "C",
      packagingType: gradingData.packagingType,
      weight: parseFloat(gradingData.weight),
      temperature: gradingData.temperature ? parseFloat(gradingData.temperature) : undefined,
      humidity: gradingData.humidity ? parseFloat(gradingData.humidity) : undefined,
      storageStartDate: gradingData.storageStartDate || undefined,
    };

    const updatedBatches = batches.map(batch => 
      batch.id === selectedBatch.id ? updatedBatch : batch
    );

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));

    setSelectedBatch(null);
    setGradingData({
      grade: "",
      packagingType: "",
      weight: "",
      temperature: "",
      humidity: "",
      storageStartDate: "",
    });

    setIsProcessing(false);

    toast({
      title: "Batch Approved",
      description: `Crop batch from ${updatedBatch.farmerName} has been approved successfully`,
    });
  };

  const handleRejectBatch = () => {
    if (!selectedBatch) return;

    setIsProcessing(true);

    const updatedBatch: CropBatch = {
      ...selectedBatch,
      status: "Rejected",
    };

    const updatedBatches = batches.map(batch => 
      batch.id === selectedBatch.id ? updatedBatch : batch
    );

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));

    setSelectedBatch(null);
    setGradingData({
      grade: "",
      packagingType: "",
      weight: "",
      temperature: "",
      humidity: "",
      storageStartDate: "",
    });

    setIsProcessing(false);

    toast({
      title: "Batch Rejected",
      description: `Crop batch from ${updatedBatch.farmerName} has been rejected`,
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    localStorage.removeItem("currentUser");
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
    pending: batches.filter(b => b.status === "Pending").length,
    approved: batches.filter(b => b.status === "Approved").length,
    rejected: batches.filter(b => b.status === "Rejected").length,
    farmers: new Set(batches.map(b => b.farmerId)).size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-800">AgriPost Admin</h1>
                <p className="text-sm text-blue-600">Management Dashboard</p>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Farmers</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.farmers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Crop Batches</CardTitle>
          </CardHeader>
          <CardContent>
            {batches.length === 0 ? (
              <div className="text-center py-8">
                <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No crop batches submitted yet</p>
                <p className="text-sm text-gray-400">Batches will appear here when farmers submit them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Harvest Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{batch.farmerName || batch.farmerId}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{batch.cropName}</TableCell>
                        <TableCell>{batch.quantity} {batch.unit}</TableCell>
                        <TableCell>{batch.harvestDate}</TableCell>
                        <TableCell>{batch.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(batch.status)}>
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{batch.submittedDate}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleProcessBatch(batch)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Process
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Process Crop Batch - {batch.farmerName}</DialogTitle>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                  <h3 className="font-semibold mb-2">Batch Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Farmer:</span> {batch.farmerName}</p>
                                    <p><span className="font-medium">Crop:</span> {batch.cropName}</p>
                                    <p><span className="font-medium">Quantity:</span> {batch.quantity} {batch.unit}</p>
                                    <p><span className="font-medium">Harvest Date:</span> {batch.harvestDate}</p>
                                    <p><span className="font-medium">Location:</span> {batch.location}</p>
                                    <p><span className="font-medium">Submitted:</span> {batch.submittedDate}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-semibold mb-2">Current Status</h3>
                                  <Badge className={getStatusColor(batch.status)}>
                                    {batch.status}
                                  </Badge>
                                  
                                  {batch.status === "Approved" && (
                                    <div className="mt-4 space-y-2 text-sm">
                                      <p><span className="font-medium">Grade:</span> {batch.grade}</p>
                                      <p><span className="font-medium">Packaging:</span> {batch.packagingType}</p>
                                      <p><span className="font-medium">Weight:</span> {batch.weight} kg</p>
                                      {batch.temperature && <p><span className="font-medium">Temperature:</span> {batch.temperature}°C</p>}
                                      {batch.humidity && <p><span className="font-medium">Humidity:</span> {batch.humidity}%</p>}
                                      {batch.storageStartDate && <p><span className="font-medium">Storage Start:</span> {batch.storageStartDate}</p>}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {batch.status === "Pending" && (
                                <div className="space-y-4">
                                  <h3 className="font-semibold">Grading & Processing Details</h3>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="grade">Grade *</Label>
                                      <Select value={gradingData.grade} onValueChange={(value) => setGradingData({...gradingData, grade: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="A">Grade A</SelectItem>
                                          <SelectItem value="B">Grade B</SelectItem>
                                          <SelectItem value="C">Grade C</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="packagingType">Packaging Type *</Label>
                                      <Input
                                        id="packagingType"
                                        placeholder="e.g., Jute bags, Plastic bags"
                                        value={gradingData.packagingType}
                                        onChange={(e) => setGradingData({...gradingData, packagingType: e.target.value})}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="weight">Processed Weight (kg) *</Label>
                                      <Input
                                        id="weight"
                                        type="number"
                                        placeholder="1000"
                                        value={gradingData.weight}
                                        onChange={(e) => setGradingData({...gradingData, weight: e.target.value})}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="storageStartDate">Storage Start Date</Label>
                                      <Input
                                        id="storageStartDate"
                                        type="date"
                                        value={gradingData.storageStartDate}
                                        onChange={(e) => setGradingData({...gradingData, storageStartDate: e.target.value})}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="temperature">Storage Temperature (°C)</Label>
                                      <Input
                                        id="temperature"
                                        type="number"
                                        placeholder="25"
                                        value={gradingData.temperature}
                                        onChange={(e) => setGradingData({...gradingData, temperature: e.target.value})}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="humidity">Storage Humidity (%)</Label>
                                      <Input
                                        id="humidity"
                                        type="number"
                                        placeholder="60"
                                        value={gradingData.humidity}
                                        onChange={(e) => setGradingData({...gradingData, humidity: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex space-x-4 pt-4">
                                    <Button 
                                      onClick={handleApproveBatch}
                                      disabled={isProcessing}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      {isProcessing ? "Processing..." : "Approve Batch"}
                                    </Button>
                                    
                                    <Button 
                                      onClick={handleRejectBatch}
                                      disabled={isProcessing}
                                      variant="destructive"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject Batch
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
