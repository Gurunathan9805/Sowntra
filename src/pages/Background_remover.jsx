import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  // Load the U²-Net model
  const loadModel = async () => {
    if (!modelRef.current) {
      try {
        modelRef.current = await tf.loadGraphModel("/model/u2net/model.json");
        console.log("✅ Model loaded successfully!");
      } catch (err) {
        console.error("❌ Error loading model:", err);
      }
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setProcessedImage(null);
    }
  };

  const removeBackground = async () => {
    if (!imgRef.current || !canvasRef.current || !modelRef.current) {
      console.warn("Image, Canvas, or Model not ready yet!");
      return;
    }

    const model = modelRef.current;
    const imgElement = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Wait until image fully loads
    await new Promise((resolve) => {
      if (imgElement.complete) resolve(true);
      else imgElement.onload = () => resolve(true);
    });

    // Preprocess image
    const inputTensor = tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(imgElement).toFloat();
      const resized = tf.image.resizeBilinear(imgTensor, [320, 320]);
      return resized.div(255.0).expandDims(0);
    });

    console.log("🔍 Predicting mask...");
    const prediction = await model.predict(inputTensor);
    const mask = tf.tidy(() => prediction.squeeze().mul(255).toInt());
    const maskData = await tf.browser.toPixels(mask);

    // Draw original image
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Apply mask as transparency
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 3] = maskData[i]; // use R channel as alpha
    }
    ctx.putImageData(imageData, 0, 0);

    // Save as base64 image
    const result = canvas.toDataURL("image/png");
    setProcessedImage(result);

    tf.dispose([inputTensor, mask, prediction]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🪄 Background Remover (TensorFlow.js + U²-Net)</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {originalImage && (
        <div style={{ marginTop: "20px" }}>
          <h4>Original Image:</h4>
          <img
            ref={imgRef}
            src={originalImage}
            alt="Original"
            style={{ maxWidth: "300px", border: "1px solid #ccc" }}
          />
        </div>
      )}

      <button
        onClick={removeBackground}
        disabled={!originalImage}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: originalImage ? "pointer" : "not-allowed",
        }}
      >
        Remove Background
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {processedImage && (
        <div style={{ marginTop: "20px" }}>
          <h4>Result:</h4>
          <img
            src={processedImage}
            alt="Processed"
            style={{ maxWidth: "300px", border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
