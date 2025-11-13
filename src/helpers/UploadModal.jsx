import React, { useRef, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const UploadModal = ({ setUploadModalOpen }) => {
  const uploadFileInputRef = useRef(null);

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

  const categories = [
    "All",
    "Social Media",
    "Documents",
    "Presentations",
    "Business",
    "Marketing",
    "Education",
  ];

  const styles = ["All Styles", "modern", "minimal", "bold"];
  const themes = ["All Themes", "professional", "festive", "trendy", "educational"];
  const formats = ["All Formats", "digital", "print", "video"];

  const handleUploadInputChange = (field, value) => {
    setUploadData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadData((prev) => ({
          ...prev,
          image: { name: file.name, preview: event.target.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setUploadData((prev) => ({ ...prev, isDragging: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setUploadData((prev) => ({ ...prev, isDragging: false }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadData((prev) => ({ ...prev, isDragging: false }));
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileUpload(files[0]);
  };

  // ✅ Upload to backend (MongoDB)
  const handleUpload = async () => {
    if (!uploadData.title.trim()) {
      alert("Please enter a template title");
      return;
    }

    try {
    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("category", uploadData.category);
    formData.append("style", uploadData.style);
    formData.append("theme", uploadData.theme);
    formData.append("format", uploadData.format);
    formData.append("featured", uploadData.featured);
    if (uploadData.image) {
        formData.append("image", uploadFileInputRef.current.files[0]);
    }

    const res = await fetch("http://localhost:5000/api/templates", {
        method: "POST",
        body: formData,
    });

    // --- safer JSON handling ---
    let data = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        try {
        data = await res.json();
        } catch {
        data = {};
        }
    }

    if (res.ok) {
        alert("✅ Template uploaded successfully!");
        setUploadModalOpen(false);
        setUploadData({
        title: "",
        category: "All",
        style: "All Styles",
        theme: "All Themes",
        format: "All Formats",
        image: null,
        featured: false,
        isDragging: false,
        });
    } else {
        alert("❌ " + (data.message || "Upload failed"));
    }
    } catch (err) {
        console.error("Upload error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Template</h2>
          <button
            onClick={() => setUploadModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Template Title
            </label>
            <input
              type="text"
              value={uploadData.title}
              onChange={(e) => handleUploadInputChange("title", e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Enter template title"
            />
          </div>

          {/* Dropdowns */}
          {[
            { label: "Category", field: "category", options: categories },
            { label: "Style", field: "style", options: styles },
            { label: "Theme", field: "theme", options: themes },
            { label: "Format", field: "format", options: formats },
          ].map(({ label, field, options }) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {label}
              </label>
              <select
                value={uploadData[field]}
                onChange={(e) =>
                  handleUploadInputChange(field, e.target.value)
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Upload Image
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                uploadData.isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => uploadFileInputRef.current?.click()}
            >
              {uploadData.image ? (
                <img
                  src={uploadData.image.preview}
                  alt="Preview"
                  className="mx-auto rounded-lg max-h-40 object-contain"
                />
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG files supported
                  </p>
                </>
              )}
              <input
                type="file"
                ref={uploadFileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              checked={uploadData.featured}
              onChange={(e) =>
                handleUploadInputChange("featured", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-gray-700 font-medium">
              Mark as Featured Template
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!uploadData.title?.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg mt-6"
          >
            Upload Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
