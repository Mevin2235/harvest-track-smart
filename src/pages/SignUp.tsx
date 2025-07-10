
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wheat, Users, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const SignUp = () => {
  const [farmerData, setFarmerData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    location: ""
  });
  
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  });

  const navigate = useNavigate();

  const handleFarmerSignup = () => {
    if (!farmerData.username || !farmerData.email || !farmerData.password || !farmerData.farmName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (farmerData.password !== farmerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Store farmer data in localStorage (in real app, this would be sent to backend)
    const farmers = JSON.parse(localStorage.getItem("farmers") || "[]");
    farmers.push({
      ...farmerData,
      id: Date.now(),
      userType: "farmer",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("farmers", JSON.stringify(farmers));

    toast({
      title: "Signup Successful",
      description: "Your farmer account has been created successfully!",
    });

    navigate("/");
  };

  const handleAdminSignup = () => {
    if (!adminData.username || !adminData.email || !adminData.password || !adminData.adminCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Check admin code (simple validation - in real app this would be more secure)
    if (adminData.adminCode !== "ADMIN2024") {
      toast({
        title: "Invalid Admin Code",
        description: "Please enter a valid admin code",
        variant: "destructive",
      });
      return;
    }

    // Store admin data in localStorage
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");
    admins.push({
      ...adminData,
      id: Date.now(),
      userType: "admin",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("admins", JSON.stringify(admins));

    toast({
      title: "Signup Successful",
      description: "Your admin account has been created successfully!",
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Wheat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">AgriPost</h1>
                <p className="text-green-600 text-sm">Smart Post-Harvest Management</p>
              </div>
            </Link>
            <Link to="/" className="flex items-center space-x-2 text-green-600 hover:text-green-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Create Account</CardTitle>
              <p className="text-gray-600">Join AgriPost today</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="farmer" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="farmer" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Farmer</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="farmer" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmer-username">Username*</Label>
                        <Input
                          id="farmer-username"
                          placeholder="Enter username"
                          value={farmerData.username}
                          onChange={(e) => setFarmerData({ ...farmerData, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmer-email">Email*</Label>
                        <Input
                          id="farmer-email"
                          type="email"
                          placeholder="Enter email"
                          value={farmerData.email}
                          onChange={(e) => setFarmerData({ ...farmerData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farm-name">Farm Name*</Label>
                      <Input
                        id="farm-name"
                        placeholder="Enter farm name"
                        value={farmerData.farmName}
                        onChange={(e) => setFarmerData({ ...farmerData, farmName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter location"
                        value={farmerData.location}
                        onChange={(e) => setFarmerData({ ...farmerData, location: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmer-password">Password*</Label>
                        <Input
                          id="farmer-password"
                          type="password"
                          placeholder="Enter password"
                          value={farmerData.password}
                          onChange={(e) => setFarmerData({ ...farmerData, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmer-confirm-password">Confirm Password*</Label>
                        <Input
                          id="farmer-confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={farmerData.confirmPassword}
                          onChange={(e) => setFarmerData({ ...farmerData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleFarmerSignup}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Create Farmer Account
                  </Button>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-username">Username*</Label>
                        <Input
                          id="admin-username"
                          placeholder="Enter username"
                          value={adminData.username}
                          onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email*</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="Enter email"
                          value={adminData.email}
                          onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-code">Admin Code*</Label>
                      <Input
                        id="admin-code"
                        placeholder="Enter admin code"
                        value={adminData.adminCode}
                        onChange={(e) => setAdminData({ ...adminData, adminCode: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">Contact your organization for the admin code</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password*</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter password"
                          value={adminData.password}
                          onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-confirm-password">Confirm Password*</Label>
                        <Input
                          id="admin-confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={adminData.confirmPassword}
                          onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleAdminSignup}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Create Admin Account
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/" className="text-green-600 hover:text-green-800 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
