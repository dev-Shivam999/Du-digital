import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  X,
  Globe,
  Hash,
} from "lucide-react";
import {
  PageHeader,
  Button,
  FormGroup,
  Input,
  EmptyState,
} from "../components/UI";
import { useToast, ToastContainer } from "../components/Toast";
import {
  LocationLoadingCard,
  FormLoadingOverlay,
} from "../components/LoadingStates";
import {
  getOfficeTypes,
  createOfficeType,
  deleteOfficeType,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/api";

const OfficeManager = () => {
  const [activeTab, setActiveTab] = useState("locations");
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [mapPreviewUrl, setMapPreviewUrl] = useState(null);

  // Forms state
  const [newType, setNewType] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [newLocation, setNewLocation] = useState({
    officeTypeId: "",
    officeName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    email: "",
    googleMapLink: "",
  });

  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTypes(), fetchLocations()]);
    } catch (error) {
      showError("Failed to load office data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await getOfficeTypes();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  const handleCreateType = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createOfficeType(newType);
      setNewType({ name: "", code: "", description: "" });
      fetchTypes();
      setIsTypeModalOpen(false);
      showSuccess("Office type created successfully");
    } catch (error) {
      showError("Failed to create office type");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteType = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteOfficeType(id);
      fetchTypes();
      showSuccess("Office type deleted successfully");
    } catch (error) {
      showError("Failed to delete office type");
    }
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        officeTypeId: newLocation.officeTypeId,
        officeName: newLocation.officeName,
        address: {
          line1: newLocation.line1,
          line2: newLocation.line2,
          city: newLocation.city,
          state: newLocation.state,
          country: newLocation.country,
          pincode: newLocation.pincode,
        },
        contact: {
          phone: newLocation.phone,
          email: newLocation.email,
        },
        googleMapLink: newLocation.googleMapLink,
      };

      if (editingLocation) {
        await updateLocation(editingLocation._id, payload);
        showSuccess("Location updated successfully");
      } else {
        await createLocation(payload);
        showSuccess("Location created successfully");
      }

      resetLocationForm();
      fetchLocations();
      setIsLocationModalOpen(false);
      setEditingLocation(null);
    } catch (error) {
      showError(editingLocation ? "Failed to update location" : "Failed to create location");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (editingLocation) {
      setNewLocation({
        officeTypeId: editingLocation.officeTypeId?._id || editingLocation.officeTypeId || "",
        officeName: editingLocation.officeName || "",
        line1: editingLocation.address?.line1 || "",
        line2: editingLocation.address?.line2 || "",
        city: editingLocation.address?.city || "",
        state: editingLocation.address?.state || "",
        country: editingLocation.address?.country || "",
        pincode: editingLocation.address?.pincode || "",
        phone: editingLocation.contact?.phone || "",
        email: editingLocation.contact?.email || "",
        googleMapLink: editingLocation.googleMapLink || "",
      });
    }
  }, [editingLocation]);

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setIsLocationModalOpen(true);
  };

  const handleDeleteLocation = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteLocation(id);
      fetchLocations();
      showSuccess("Location deleted successfully");
    } catch (error) {
      showError("Failed to delete location");
    }
  };

  const resetTypeForm = () => {
    setNewType({ name: "", code: "", description: "" });
  };

  const resetLocationForm = () => {
    setNewLocation({
      officeTypeId: "",
      officeName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phone: "",
      email: "",
      googleMapLink: "",
    });
    setEditingLocation(null);
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Office Management"
          description="Loading office data..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LocationLoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <PageHeader
        title="Office Management"
        description="Manage office types and locations"
        stats={[
          { label: `${types.length} Office Types`, variant: "bg-primary" },
          { label: `${locations.length} Locations`, variant: "bg-success" },
        ]}
        actions={
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                resetTypeForm();
                setIsTypeModalOpen(true);
              }}>
              <Plus size={16} />
              Add Type
            </Button>
            <Button
              onClick={() => {
                resetLocationForm();
                setIsLocationModalOpen(true);
              }}>
              <Plus size={16} />
              Add Location
            </Button>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex gap-2">
            <Button
              variant={activeTab === "locations" ? "primary" : "secondary"}
              onClick={() => setActiveTab("locations")}>
              <MapPin size={16} />
              Locations ({locations.length})
            </Button>
            <Button
              variant={activeTab === "types" ? "primary" : "secondary"}
              onClick={() => setActiveTab("types")}>
              <Building2 size={16} />
              Office Types ({types.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Office Types Tab */}
      {activeTab === "types" && (
        <div>
          {types.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No office types found"
              description="Create office types to categorize your locations (e.g., Head Office, Branch Office)."
              action={
                <Button
                  onClick={() => {
                    resetTypeForm();
                    setIsTypeModalOpen(true);
                  }}>
                  <Plus size={16} />
                  Create Your First Office Type
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map((type) => (
                <div key={type._id} className="card card-hover">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "#dbeafe",
                            color: "#3b82f6",
                          }}>
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h4
                            className="mb-1"
                            style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                            {type.name}
                          </h4>
                          <div className="d-flex align-items-center gap-1">
                            <Hash size={12} />
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.875rem" }}>
                              {type.code}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDeleteType(type._id, type.name)}
                        title="Delete office type">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {type.description && (
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.875rem" }}>
                        {type.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === "locations" && (
        <div>
          {locations.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No locations found"
              description="Add office locations to manage your business presence across different areas."
              action={
                <Button
                  onClick={() => {
                    resetLocationForm();
                    setIsLocationModalOpen(true);
                  }}>
                  <Plus size={16} />
                  Add Your First Location
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((location) => (
                <div key={location._id} className="card card-hover">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "#dcfce7",
                            color: "#16a34a",
                          }}>
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h4
                            className="mb-1"
                            style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                            {location.officeName}
                          </h4>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontSize: "0.75rem",
                            }}>
                            {location.officeTypeId?.name || "Unknown Type"}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="action-btn btn-edit"
                          onClick={() => handleEditLocation(location)}
                          title="Edit location">
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() =>
                            handleDeleteLocation(
                              location._id,
                              location.officeName
                            )
                          }
                          title="Delete location">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="d-flex align-items-start gap-2 mb-3">
                      <MapPin size={16} className="text-muted mt-1" />
                      <div style={{ fontSize: "0.875rem", lineHeight: "1.5" }}>

                        {location.address?.line1 && (
                          <div>{location.address.line1}</div>
                        )}
                        {location.address?.line2 && (
                          <div>{location.address.line2}</div>
                        )}
                        <div>
                          {location.address?.city}, {location.address?.state} -{" "}
                          {location.address?.pincode}
                        </div>
                        <div className="text-muted">
                          {location.address?.country}
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="d-flex flex-column gap-2">
                      {location.contact?.phone && (
                        <div className="d-flex align-items-center gap-2">
                          <Phone size={14} className="text-muted" />
                          <span style={{ fontSize: "0.875rem" }}>
                            {location.contact.phone}
                          </span>
                        </div>
                      )}
                      {location.contact?.email && (
                        <div className="d-flex align-items-center gap-2">
                          <Mail size={14} className="text-muted" />
                          <span style={{ fontSize: "0.875rem" }}>
                            {location.contact.email}
                          </span>
                        </div>
                      )}
                      {location.googleMapLink && (
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setMapPreviewUrl(location.googleMapLink)}
                            className="d-flex align-items-center gap-2"
                            style={{
                              color: "#3b82f6",
                              textDecoration: "none",
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer"
                            }}>
                            <Globe size={14} />
                            <span style={{ fontSize: "0.875rem" }}>
                              View on Google Maps
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Office Type Modal */}
      {isTypeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Office Type</h2>
              <button
                className="modal-close"
                onClick={() => setIsTypeModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateType} className="form-section">
              {saving && (
                <FormLoadingOverlay message="Creating office type..." />
              )}

              <div className="modal-body">
                <FormGroup label="Type Name" required>
                  <Input
                    type="text"
                    value={newType.name}
                    onChange={(e) =>
                      setNewType({ ...newType, name: e.target.value })
                    }
                    placeholder="e.g., Head Office, Branch Office"
                    required
                  />
                </FormGroup>

                <FormGroup label="Type Code" required>
                  <Input
                    type="text"
                    value={newType.code}
                    onChange={(e) =>
                      setNewType({ ...newType, code: e.target.value })
                    }
                    placeholder="e.g., HO, BO"
                    required
                  />
                </FormGroup>

                <FormGroup label="Description">
                  <textarea
                    className="form-control"
                    value={newType.description}
                    onChange={(e) =>
                      setNewType({ ...newType, description: e.target.value })
                    }
                    placeholder="Brief description of this office type..."
                    rows={3}
                  />
                </FormGroup>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsTypeModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  disabled={!newType.name || !newType.code}>
                  Create Type
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Location Modal */}
      {isLocationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "700px" }}>
            <div className="modal-header">
              <h2>{editingLocation ? "Edit Office Location" : "Add Office Location"}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setIsLocationModalOpen(false);
                  resetLocationForm();
                }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="form-section">
              {saving && <FormLoadingOverlay message={editingLocation ? "Updating location..." : "Creating location..."} />}

              <div className="modal-body">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Office Type" required>
                    <select
                      className="form-control"
                      value={newLocation.officeTypeId}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          officeTypeId: e.target.value,
                        })
                      }
                      required>
                      <option value="">Select Office Type</option>
                      {types.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup label="Office Name" required>
                    <Input
                      type="text"
                      value={newLocation.officeName}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          officeName: e.target.value,
                        })
                      }
                      placeholder="e.g., Mumbai Head Office"
                      required
                    />
                  </FormGroup>
                </div>

                <h4 className="mb-3">Address</h4>
                <FormGroup label="Address Line 1">
                  <Input
                    type="text"
                    value={newLocation.line1}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, line1: e.target.value })
                    }
                    placeholder="Street address, building name"
                  />
                </FormGroup>

                <FormGroup label="Address Line 2">
                  <Input
                    type="text"
                    value={newLocation.line2}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, line2: e.target.value })
                    }
                    placeholder="Apartment, suite, floor"
                  />
                </FormGroup>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="City">
                    <Input
                      type="text"
                      value={newLocation.city}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, city: e.target.value })
                      }
                      placeholder="City"
                    />
                  </FormGroup>

                  <FormGroup label="State">
                    <Input
                      type="text"
                      value={newLocation.state}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          state: e.target.value,
                        })
                      }
                      placeholder="State/Province"
                    />
                  </FormGroup>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Country">
                    <Input
                      type="text"
                      value={newLocation.country}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          country: e.target.value,
                        })
                      }
                      placeholder="Country"
                    />
                  </FormGroup>

                  <FormGroup label="Pincode">
                    <Input
                      type="text"
                      value={newLocation.pincode}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          pincode: e.target.value,
                        })
                      }
                      placeholder="Postal/ZIP code"
                    />
                  </FormGroup>
                </div>

                <h4 className="mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label="Phone">
                    <Input
                      type="tel"
                      value={newLocation.phone}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Phone number"
                    />
                  </FormGroup>

                  <FormGroup label="Email">
                    <Input
                      type="email"
                      value={newLocation.email}
                      onChange={(e) =>
                        setNewLocation({
                          ...newLocation,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email address"
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Google Map Link" required>
                  <Input
                    type="url"
                    value={newLocation.googleMapLink}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        googleMapLink: e.target.value,
                      })
                    }
                    placeholder="https://maps.google.com/..."
                    required
                  />
                </FormGroup>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsLocationModalOpen(false);
                    resetLocationForm();
                  }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  disabled={
                    !newLocation.officeTypeId || !newLocation.officeName || !newLocation.googleMapLink
                  }>
                  {editingLocation ? "Update Location" : "Create Location"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Maps Preview Modal */}
      {mapPreviewUrl && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "900px", height: "80vh" }}>
            <div className="modal-header">
              <h2>Google Maps Preview</h2>
              <button
                className="modal-close"
                onClick={() => setMapPreviewUrl(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 0, height: "calc(100% - 120px)" }}>
              <iframe
                src={mapPreviewUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Preview"
              />
            </div>
            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setMapPreviewUrl(null)}>
                Close
              </Button>
              <Button
                onClick={() => window.open(mapPreviewUrl, "_blank")}>
                <Globe size={16} />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeManager;
