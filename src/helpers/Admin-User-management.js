import { useState } from "react";

const useAdminManagement = (currentUser) => {
  // Admin Management State
  const [adminState, setAdminState] = useState({
    showUserManagement: false,
    showAddUserModal: false,
    editingUser: null,
    userSearchTerm: "",
    userFilterRole: "all",
    showProfileEditModal: false,
    editingProfile: null,
  });

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "designer",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  });

  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTemplates: 0,
    totalViews: 0,
    totalUsers: 1,
  });

  // Users State
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Designer",
      email: "john@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "admin",
      joinDate: "2024-01-15",
      templatesCreated: 23,
      lastActive: new Date().toISOString(),
      status: "active",
      permissions: ["all"],
    },
  ]);

  // ADMIN USER MANAGEMENT FUNCTIONS
  const addNewUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const userExists = users.find((user) => user.email === newUser.email);
    if (userExists) {
      alert("A user with this email already exists");
      return;
    }

    const userPermissions = {
      admin: ["all"],
      designer: ["create", "edit", "view"],
      marketer: ["view", "use"],
      viewer: ["view"],
    };

    const newUserObj = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
      joinDate: new Date().toISOString().split("T")[0],
      templatesCreated: 0,
      lastActive: new Date().toISOString(),
      status: "active",
      permissions: userPermissions[newUser.role] || ["view"],
    };

    setUsers((prev) => [...prev, newUserObj]);

    setNewUser({
      name: "",
      email: "",
      role: "designer",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    });

    setAdminState((prev) => ({ ...prev, showAddUserModal: false }));

    // Update analytics
    setAnalytics((prev) => ({
      ...prev,
      totalUsers: (prev.totalUsers || 0) + 1,
    }));

    alert("User added successfully!");
  };

  const updateUserRole = (userId, newRole) => {
    const userPermissions = {
      admin: ["all"],
      designer: ["create", "edit", "view"],
      marketer: ["view", "use"],
      viewer: ["view"],
    };

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: newRole,
              permissions: userPermissions[newRole] || ["view"],
            }
          : user
      )
    );
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const deleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own account");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      alert("User deleted successfully");
    }
  };

  return {
    adminState,
    setAdminState,
    newUser,
    setNewUser,
    analytics,
    setAnalytics,
    users,
    setUsers,
    addNewUser,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
  };
};

export default useAdminManagement;
