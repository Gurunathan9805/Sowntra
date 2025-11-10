import { useState } from "react";

const useUploadHandlers = (currentUser, setTemplates, setUsers, setUploadModalOpen) => {
  const [uploadData, setUploadData] = useState({
    title: "",
    category: "All",
    style: "All Styles",
    theme: "All Themes",
    format: "All Formats",
    image: null,
    featured: false,
    isDragging: false,
  });

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadData((prev) => ({
          ...prev,
          files: [file],
          thumbnail: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadInputChange = (field, value) => {
    setUploadData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpload = () => {
    if (!uploadData.title.trim()) {
      alert("Please enter a template title");
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: uploadData.title,
      category: uploadData.category,
      tags:
        uploadData.tags
          ?.split(",")
          .map((t) => t.trim())
          .filter((t) => t) || [],
      thumbnail:
        uploadData.thumbnail ||
        `https://via.placeholder.com/300x200/f59e0b/ffffff?text=${encodeURIComponent(uploadData.title)}`,
      visibility: uploadData.visibility || "public",
      creator: currentUser?.name || "Unknown",
      creatorId: currentUser?.id || 0,
      creatorAvatar: currentUser?.avatar || "",
      date: new Date().toISOString().split("T")[0],
      json: { layers: [], assets: [] },
      views: 0,
      uses: 0,
      likes: 0,
      downloads: 0,
    };

    setTemplates((prev) => [newTemplate, ...prev]);

    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? { ...user, templatesCreated: user.templatesCreated + 1 }
          : user
      )
    );

    setUploadModalOpen(false);
    alert("Template uploaded successfully!");

    setUploadData({
      title: "",
      category: "All",
      style: "All Styles",
      theme: "All Themes",
      format: "All Formats",
      image: null,
      featured: false,
      isDragging: false,
      thumbnail: null,
    });
  };

  return {
    uploadData,
    handleFileUpload,
    handleUploadInputChange,
    handleUpload,
    setUploadData,
  };
};
