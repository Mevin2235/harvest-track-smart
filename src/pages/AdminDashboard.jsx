import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [storageData, setStorageData] = useState({
    temperature: "",
    humidity: "",
    storageStartDate: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
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

  const handleProcessBatch = (batch) => {
    setSelectedBatch(batch);
    setIsEditing(false);
    setStorageData({
      temperature: batch.temperature?.toString() || "",
      humidity: batch.humidity?.toString() || "",
      storageStartDate: batch.storageStartDate || "",
    });
  };

  const handleEditBatch = (batch) => {
    setSelectedBatch(batch);
    setIsEditing(true);
    setEditData({
      cropName: batch.cropName,
      quantity: batch.quantity,
      unit: batch.unit,
      harvestDate: batch.harvestDate,
      location: batch.location,
      grade: batch.grade,
      packagingType: batch.packagingType,
      weight: batch.weight,
    });
    setStorageData({
      temperature: batch.temperature?.toString() || "",
      humidity: batch.humidity?.toString() || "",
      storageStartDate: batch.storageStartDate || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = () => {
    if (!selectedBatch) return;

    setIsProcessing(true);

    const updatedBatch = {
      ...selectedBatch,
      ...editData,
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
    setEditData({});
    setIsEditing(false);
    setIsProcessing(false);

    toast({
      title: "Batch Updated",
      description: `Crop batch from ${updatedBatch.farmerName} has been updated successfully`,
    });
  };

  const handleApproveBatch = () => {
    if (!selectedBatch) return;

    setIsProcessing(true);

    const updatedBatch = {
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

    const updatedBatch = {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" };
      case "Rejected":
        return { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" };
      default:
        return { backgroundColor: "#fef9c3", color: "#854d0e", borderColor: "#fef08a" };
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #eff6ff, #e0f2fe, #c7d2fe)"
    }}>
      <header style={{
        backgroundColor: "white",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid #e0f2fe",
        padding: "1rem 0"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                padding: "0.5rem",
                backgroundColor: "#2563eb",
                borderRadius: "0.5rem"
              }}>
                <svg style={{ height: "1.5rem", width: "1.5rem", color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1e40af" }}>AgriPost Admin</h1>
                <p style={{ fontSize: "0.875rem", color: "#2563eb" }}>Management Dashboard</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "#374151" }}>Welcome, {username}</span>
              <button 
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "transparent",
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}
              >
                <svg style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "2rem 1rem"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          {/* Stats Cards */}
          {[
            { icon: "📦", title: "Total Batches", value: stats.total, color: "#2563eb" },
            { icon: "🟡", title: "Pending", value: stats.pending, color: "#ca8a04" },
            { icon: "🟢", title: "Approved", value: stats.approved, color: "#16a34a" },
            { icon: "🔴", title: "Rejected", value: stats.rejected, color: "#dc2626" },
            { icon: "👨‍🌾", title: "Active Farmers", value: stats.farmers, color: "#7c3aed" }
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{stat.icon}</span>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{stat.title}</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: stat.color }}>{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>All Crop Batches from All Farmers</h2>
          </div>
          
          <div style={{ padding: "1.5rem" }}>
            {batches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ margin: "0 auto", marginBottom: "1rem" }}>
                  <svg style={{ height: "3rem", width: "3rem", color: "#9ca3af" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <p style={{ color: "#6b7280" }}>No crop batches submitted yet</p>
                <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Batches will appear here when farmers submit them</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                      {["Farmer", "Crop", "Quantity", "Harvest Date", "Location", "Status", "Submitted", "Actions"].map((header) => (
                        <th key={header} style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#6b7280"
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <svg style={{ height: "1rem", width: "1rem", color: "#6b7280" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span style={{ fontWeight: "500" }}>{batch.farmerName || batch.farmerId}</span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem", fontWeight: "500" }}>{batch.cropName}</td>
                        <td style={{ padding: "1rem" }}>{batch.quantity} {batch.unit}</td>
                        <td style={{ padding: "1rem" }}>{batch.harvestDate}</td>
                        <td style={{ padding: "1rem" }}>{batch.location}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            ...getStatusColor(batch.status)
                          }}>
                            {batch.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem" }}>{batch.submittedDate}</td>
                        <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                          <button 
                            onClick={() => handleProcessBatch(batch)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              border: "1px solid #e5e7eb",
                              backgroundColor: "transparent",
                              fontSize: "0.875rem"
                            }}
                          >
                            <svg style={{ height: "1rem", width: "1rem", marginRight: "0.25rem" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Process
                          </button>
                          <button 
                            onClick={() => handleEditBatch(batch)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              border: "1px solid #e5e7eb",
                              backgroundColor: "transparent",
                              fontSize: "0.875rem"
                            }}
                          >
                            <svg style={{ height: "1rem", width: "1rem", marginRight: "0.25rem" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batch Processing Modal */}
      {selectedBatch && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            width: "100%",
            maxWidth: "42rem",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                {isEditing ? "Edit" : "Process"} Crop Batch - {selectedBatch.farmerName || selectedBatch.farmerId}
              </h3>
            </div>
            
            <div style={{ padding: "1.5rem" }}>
              {/* Batch Information */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Batch Information</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Farmer</p>
                    <p style={{ fontWeight: "500" }}>{selectedBatch.farmerName || selectedBatch.farmerId}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Crop</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="cropName"
                        value={editData.cropName}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      />
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.cropName}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Quantity</p>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="number"
                          name="quantity"
                          value={editData.quantity}
                          onChange={handleEditChange}
                          style={{
                            width: "70%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem"
                          }}
                        />
                        <select
                          name="unit"
                          value={editData.unit}
                          onChange={handleEditChange}
                          style={{
                            width: "30%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem"
                          }}
                        >
                          <option value="kg">kg</option>
                          <option value="tons">tons</option>
                          <option value="quintals">quintals</option>
                        </select>
                      </div>
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.quantity} {selectedBatch.unit}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Harvest Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        name="harvestDate"
                        value={editData.harvestDate}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      />
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.harvestDate}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      />
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.location}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Submitted</p>
                    <p style={{ fontWeight: "500" }}>{selectedBatch.submittedDate}</p>
                  </div>
                </div>
              </div>

              {/* Quality Details */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Quality Details</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "1rem",
                  backgroundColor: "#eff6ff",
                  padding: "1rem",
                  borderRadius: "0.375rem"
                }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Grade</p>
                    {isEditing ? (
                      <select
                        name="grade"
                        value={editData.grade || ""}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      >
                        <option value="">Select grade</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                      </select>
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.grade || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Packaging</p>
                    {isEditing ? (
                      <select
                        name="packagingType"
                        value={editData.packagingType || ""}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      >
                        <option value="">Select packaging</option>
                        <option value="Bags">Bags</option>
                        <option value="Crates">Crates</option>
                        <option value="Boxes">Boxes</option>
                      </select>
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.packagingType || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Weight (kg)</p>
                    {isEditing ? (
                      <input
                        type="number"
                        name="weight"
                        value={editData.weight || ""}
                        onChange={handleEditChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      />
                    ) : (
                      <p style={{ fontWeight: "500" }}>{selectedBatch.weight ? `${selectedBatch.weight} kg` : "Not specified"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Status */}
              {!isEditing && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Current Status</h4>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    ...getStatusColor(selectedBatch.status)
                  }}>
                    {selectedBatch.status}
                  </span>
                </div>
              )}

              {/* Storage Conditions */}
              {(selectedBatch.status === "Pending" || isEditing) && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Storage Conditions (Optional)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "#6b7280" }}>
                        Storage Start Date
                      </label>
                      <input
                        type="date"
                        value={storageData.storageStartDate}
                        onChange={(e) => setStorageData({...storageData, storageStartDate: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e5e7eb",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "#6b7280" }}>
                        Temperature (°C)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          placeholder="25"
                          value={storageData.temperature}
                          onChange={(e) => setStorageData({...storageData, temperature: e.target.value})}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem",
                            paddingRight: "2rem"
                          }}
                        />
                        <svg style={{
                          position: "absolute",
                          right: "0.75rem",
                          top: "0.75rem",
                          height: "1rem",
                          width: "1rem",
                          color: "#9ca3af"
                        }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "#6b7280" }}>
                        Humidity (%)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          placeholder="60"
                          value={storageData.humidity}
                          onChange={(e) => setStorageData({...storageData, humidity: e.target.value})}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "1px solid #e5e7eb",
                            fontSize: "0.875rem",
                            paddingRight: "2rem"
                          }}
                        />
                        <svg style={{
                          position: "absolute",
                          right: "0.75rem",
                          top: "0.75rem",
                          height: "1rem",
                          width: "1rem",
                          color: "#9ca3af"
                        }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
                          <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem" }}>
                <button
                  onClick={() => {
                    setSelectedBatch(null);
                    setIsEditing(false);
                  }}
                  disabled={isProcessing}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                
                {isEditing ? (
                  <button
                    onClick={handleSaveEdit}
                    disabled={isProcessing}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    <svg style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                  </button>
                ) : selectedBatch.status === "Pending" ? (
                  <>
                    <button
                      onClick={handleRejectBatch}
                      disabled={isProcessing}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      <svg style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject Batch
                    </button>
                    <button
                      onClick={handleApproveBatch}
                      disabled={isProcessing}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        backgroundColor: "#166534",
                        color: "white",
                        border: "none",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      <svg style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Approve Batch
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;