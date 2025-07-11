import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserType } from "@/utils/auth";
import { toast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children, requiredUserType }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const userType = getUserType();
    if (userType !== requiredUserType) {
      toast({
        title: "Access Denied",
        description: `This page is only accessible to ${requiredUserType}s`,
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, requiredUserType]);

  if (!isAuthenticated() || getUserType() !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
