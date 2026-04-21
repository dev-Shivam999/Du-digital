import { useState, useEffect } from "react";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../services/api";

const TeamMemberManager = () => {
  const [teamData, setTeamData] = useState([]); // Array or Object depending on grouping
  const [isGrouped, setIsGrouped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    profileImage: "", // Can be string URL or File object
    category: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, [isGrouped]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const groupBy = isGrouped ? "category" : "";
      const data = await getTeamMembers(groupBy);
      setTeamData(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      alert("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("category", formData.category);
      data.append("description", formData.description);

      if (formData.profileImage instanceof File) {
        data.append("image", formData.profileImage);
      } else if (
        typeof formData.profileImage === "string" &&
        formData.profileImage
      ) {
        // Even if it's a string, we might want to send it if the backend supports URL updates,
        // but typically we rely on the file input for changes.
        // If no new file, backend keeps old image.
      }

      if (editingId) {
        await updateTeamMember(editingId, data); // API needs to handle FormData
        alert("Team member updated");
      } else {
        await createTeamMember(data); // API needs to handle FormData
        alert("Team member created");
      }
      setShowModal(false);
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Failed to save team member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteTeamMember(id);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete");
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      designation: member.designation,
      profileImage: member.profileImage || "",
      category: member.category || "",
      description: member.description || "",
    });
    if (member.profileImage) {
      // Check if it's a full URL or a relative path from uploads
      const isUrl = member.profileImage.startsWith("http");
      const preview = isUrl
        ? member.profileImage
        : `${import.meta.env.VITE_API_BASE_URL}${member.profileImage}`;
      setImagePreview(preview);
    } else {
      setImagePreview(null);
    }
    setEditingId(member._id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      profileImage: "",
      category: "",
      description: "",
    });
    setImagePreview(null);
    setEditingId(null);
  };

  // Render logic for List Item
  const renderMemberCard = (member) => (
    <div
      key={member._id}
      style={{
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#fff",
      }}>
      <img
        src={
          member.profileImage
            ? member.profileImage.startsWith("http")
              ? member.profileImage
              : `${import.meta.env.VITE_API_BASE_URL}${member.profileImage}`
            : "https://via.placeholder.com/60"
        }
        alt={member.name}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0 }}>{member.name}</h4>
        <p style={{ margin: "0.2rem 0", color: "#666", fontSize: "0.9rem" }}>
          {member.designation}
        </p>
        <span
          style={{
            fontSize: "0.8rem",
            backgroundColor: "#e9ecef",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
          }}>
          {member.category || "Uncategorized"}
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => handleEdit(member)} style={btnEdit}>
          Edit
        </button>
        <button onClick={() => handleDelete(member._id)} style={btnDelete}>
          Delete
        </button>
      </div>
    </div>
  );

  const btnEdit = {
    padding: "5px 10px",
    backgroundColor: "#ffc107",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const btnDelete = {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}>
        <h2>Team Members</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}>
            <input
              type="checkbox"
              checked={isGrouped}
              onChange={(e) => setIsGrouped(e.target.checked)}
            />
            Group by Category
          </label>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            + Add Member
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isGrouped && !Array.isArray(teamData) ? (
            Object.keys(teamData).map((category) => (
              <div key={category} style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    borderBottom: "2px solid #007bff",
                    paddingBottom: "0.5rem",
                    marginBottom: "1rem",
                    color: "#0056b3",
                  }}>
                  {category}
                </h3>
                <div>{teamData[category].map(renderMemberCard)}</div>
              </div>
            ))
          ) : !isGrouped && Array.isArray(teamData) ? (
            <div>{teamData.map(renderMemberCard)}</div>
          ) : null}
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}>
            <h3>{editingId ? "Edit Team Member" : "Add Team Member"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={inputStyle}
                required
              />

              <label>Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                style={inputStyle}
                required
              />

              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                style={inputStyle}
                placeholder="e.g. Leadership, Advisory"
              />

              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, profileImage: file });
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={inputStyle}
              />
              {imagePreview && (
                <div style={{ marginBottom: "1rem" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}

              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{ ...inputStyle, height: "80px" }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "1rem",
                }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberManager;
