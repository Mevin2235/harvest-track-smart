import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wheat, Users, ShieldCheck, Truck, Package, Thermometer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = (userType) => {
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Login Required",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    // Check credentials based on user type
    if (userType === "farmer") {
      const farmers = JSON.parse(localStorage.getItem("farmers") || "[]");
      const farmer = farmers.find((f) => 
        f.username === loginData.username && f.password === loginData.password
      );

      if (!farmer) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password for farmer account",
          variant: "destructive",
        });
        return;
      }

      // Store authenticated user data
      localStorage.setItem("userType", "farmer");
      localStorage.setItem("currentUser", JSON.stringify(farmer));
      localStorage.setItem("username", farmer.username);
    } else {
      const admins = JSON.parse(localStorage.getItem("admins") || "[]");
      const admin = admins.find((a) => 
        a.username === loginData.username && a.password === loginData.password
      );

      if (!admin) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password for admin account",
          variant: "destructive",
        });
        return;
      }

      // Store authenticated user data
      localStorage.setItem("userType", "admin");
      localStorage.setItem("currentUser", JSON.stringify(admin));
      localStorage.setItem("username", admin.username);
    }

    toast({
      title: "Login Successful",
      description: `Welcome ${loginData.username}!`,
    });

    // Navigate to appropriate dashboard
    navigate(userType === "farmer" ? "/farmer-dashboard" : "/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">AgriPost</h1>
              <p className="text-green-600 text-sm">Smart Post-Harvest Management</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Revolutionize Your Post-Harvest Process
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Streamline crop management from harvest to storage with our intelligent digital platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Smart Grading</h3>
                  <p className="text-sm text-gray-600">Automated quality assessment and classification</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Thermometer className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Storage Monitoring</h3>
                  <p className="text-sm text-gray-600">Real-time temperature and humidity tracking</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Supply Chain</h3>
                  <p className="text-sm text-gray-600">End-to-end batch tracking and management</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Quality Assurance</h3>
                  <p className="text-sm text-gray-600">Comprehensive approval and rejection system</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">💡 Reduce Post-Harvest Losses</h3>
              <p className="text-green-700 text-sm">
                Join thousands of farmers and agricultural businesses reducing waste and increasing profits through better post-harvest management.
              </p>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-800">Login to AgriPost</CardTitle>
                <p className="text-gray-600">Choose your role to get started</p>
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <TabsContent value="farmer" className="mt-4">
                    <Button
                      onClick={() => handleLogin("farmer")}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Login as Farmer
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Submit and track your crop batches
                    </p>
                  </TabsContent>

                  <TabsContent value="admin" className="mt-4">
                    <Button
                      onClick={() => handleLogin("admin")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Login as Admin
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Manage grading, storage, and approvals
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-green-600 hover:text-green-800 font-medium">
                      Sign up here
                    </Link>
                  </p>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Demo: Create an account or use existing credentials
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;