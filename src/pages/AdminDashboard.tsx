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
  User,
  Scale,
  Edit,
  Save
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    cropName: "",
    quantity: "",
    unit: "",
    harvestDate: "",
    location: "",
    grade: "",
    packagingType: "",
    weight: "",
  });
  const [storageData, setStorageData] = useState({
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
    setIsEditing(false);
    
    // Pre-fill edit data
    setEditData({
      cropName: batch.cropName,
      quantity: batch.quantity.toString(),
      unit: batch.unit,
      harvestDate: batch.harvestDate,
      location: batch.location,
      grade: batch.grade || "",
      packagingType: batch.packagingType || "",
      weight: batch.weight?.toString() || "",
    });
    
    // Pre-fill existing storage data if available
    setStorageData({
      temperature: batch.temperature?.toString() || "",
      humidity: batch.humidity?.toString() || "",
      storageStartDate: batch.storageStartDate || "",
    });
  };

  const handleSaveEdit = () => {
    if (!selectedBatch) return;

    setIsProcessing(true);

    const updatedBatch: CropBatch = {
      ...selectedBatch,
      cropName: editData.cropName,
      quantity: parseFloat(editData.quantity),
      unit: editData.unit,
      harvestDate: editData.harvestDate,
      location: editData.location,
      grade: editData.grade as "A" | "B" | "C",
      packagingType: editData.packagingType,
      weight: editData.weight ? parseFloat(editData.weight) : undefined,
    };

    const updatedBatches = batches.map(batch => 
      batch.id === selectedBatch.id ? updatedBatch : batch
    );

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));
    setSelectedBatch(updatedBatch);
    setIsEditing(false);
    setIsProcessing(false);

    toast({
      title: "Batch Updated",
      description: "Crop batch details have been updated successfully",
    });
  };

  const handleApproveBatch = () => {
    if (!selectedBatch) return;

    setIsProcessing(true);

    const updatedBatch: CropBatch = {
      ...selectedBatch,
      status: "Approved",
      temperature: storageData.temperature ? parseFloat(storageData.temperature) : undefined,
      humidity: storageData.humidity ? parseFloat(storageData.humidity) : undefined,
      storageStartDate: storageData.storageStartDate || undefined,
    };

    const updatedBatches = batches.map(batch => 
      batch.id === selectedBatch.id ? updatedBatch : batch
    );

    setBatches(updatedBatches);
    localStorage.setItem("cropBatches", JSON.stringify(updatedBatches));

    setSelectedBatch(null);
    setStorageData({
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
    setStorageData({
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

        {/* All Crop Batches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Crop Batches from All Farmers</CardTitle>
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
                      <TableHead>Grade</TableHead>
                      <TableHead>Packaging</TableHead>
                      <TableHead>Weight</TableHead>
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
                          <div className="flex items-center space-x-2">
                            <Scale className="h-4 w-4 text-blue-600" />
                            <Badge variant="outline">{batch.grade}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{batch.packagingType}</TableCell>
                        <TableCell>{batch.weight} kg</TableCell>
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
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <span>Process Crop Batch - {batch.farmerName}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    {isEditing ? "Cancel Edit" : "Edit Details"}
                                  </Button>
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div>
                                  <h3 className="font-semibold mb-4">Batch Information</h3>
                                  {isEditing ? (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="cropName">Crop Name</Label>
                                        <Input
                                          id="cropName"
                                          value={editData.cropName}
                                          onChange={(e) => setEditData({...editData, cropName: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                          <Label htmlFor="quantity">Quantity</Label>
                                          <Input
                                            id="quantity"
                                            type="number"
                                            value={editData.quantity}
                                            onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="unit">Unit</Label>
                                          <Select
                                            value={editData.unit}
                                            onValueChange={(value) => setEditData({...editData, unit: value})}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="kg">kg</SelectItem>
                                              <SelectItem value="tons">tons</SelectItem>
                                              <SelectItem value="bags">bags</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="harvestDate">Harvest Date</Label>
                                        <Input
                                          id="harvestDate"
                                          type="date"
                                          value={editData.harvestDate}
                                          onChange={(e) => setEditData({...editData, harvestDate: e.target.value})}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                          id="location"
                                          value={editData.location}
                                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                                        />
                                      </div>

                                      <Button 
                                        onClick={handleSaveEdit}
                                        disabled={isProcessing}
                                        className="w-full"
                                      >
                                        <Save className="h-4 w-4 mr-2" />
                                        {isProcessing ? "Saving..." : "Save Changes"}
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Farmer:</span> {selectedBatch?.farmerName}</p>
                                      <p><span className="font-medium">Crop:</span> {selectedBatch?.cropName}</p>
                                      <p><span className="font-medium">Quantity:</span> {selectedBatch?.quantity} {selectedBatch?.unit}</p>
                                      <p><span className="font-medium">Harvest Date:</span> {selectedBatch?.harvestDate}</p>
                                      <p><span className="font-medium">Location:</span> {selectedBatch?.location}</p>
                                      <p><span className="font-medium">Submitted:</span> {selectedBatch?.submittedDate}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <h3 className="font-semibold mb-4">Quality Details</h3>
                                  {isEditing ? (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="grade">Grade</Label>
                                        <Select
                                          value={editData.grade}
                                          onValueChange={(value) => setEditData({...editData, grade: value})}
                                        >
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
                                        <Label htmlFor="packagingType">Packaging Type</Label>
                                        <Input
                                          id="packagingType"
                                          value={editData.packagingType}
                                          onChange={(e) => setEditData({...editData, packagingType: e.target.value})}
                                          placeholder="e.g., Jute bags, Plastic containers"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                          id="weight"
                                          type="number"
                                          value={editData.weight}
                                          onChange={(e) => setEditData({...editData, weight: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-md">
                                      <p><span className="font-medium">Grade:</span> {selectedBatch?.grade}</p>
                                      <p><span className="font-medium">Packaging:</span> {selectedBatch?.packagingType}</p>
                                      <p><span className="font-medium">Weight:</span> {selectedBatch?.weight} kg</p>
                                    </div>
                                  )}
                                  
                                  <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Current Status</h4>
                                    <Badge className={getStatusColor(selectedBatch?.status || "")}>
                                      {selectedBatch?.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {selectedBatch?.status === "Pending" && !isEditing && (
                                <div className="space-y-4">
                                  <h3 className="font-semibold">Storage Conditions (Optional)</h3>
                                  
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="storageStartDate">Storage Start Date</Label>
                                      <Input
                                        id="storageStartDate"
                                        type="date"
                                        value={storageData.storageStartDate}
                                        onChange={(e) => setStorageData({...storageData, storageStartDate: e.target.value})}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="temperature">Storage Temperature (°C)</Label>
                                      <Input
                                        id="temperature"
                                        type="number"
                                        placeholder="25"
                                        value={storageData.temperature}
                                        onChange={(e) => setStorageData({...storageData, temperature: e.target.value})}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="humidity">Storage Humidity (%)</Label>
                                      <Input
                                        id="humidity"
                                        type="number"
                                        placeholder="60"
                                        value={storageData.humidity}
                                        onChange={(e) => setStorageData({...storageData, humidity: e.target.value})}
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

                              {selectedBatch?.status === "Approved" && (
                                <div className="bg-green-50 p-4 rounded-md">
                                  <h4 className="font-semibold mb-2">Storage Conditions</h4>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    {selectedBatch.storageStartDate && <p><span className="font-medium">Storage Start:</span> {selectedBatch.storageStartDate}</p>}
                                    {selectedBatch.temperature && <p><span className="font-medium">Temperature:</span> {selectedBatch.temperature}°C</p>}
                                    {selectedBatch.humidity && <p><span className="font-medium">Humidity:</span> {selectedBatch.humidity}%</p>}
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
