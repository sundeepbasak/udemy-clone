"use client";

import { useState } from "react";

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    console.log({ selectedFile });
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("video", selectedFile);

      try {
        const response = await fetch("UPLOAD_URL", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        console.log("Upload successful", response);
      } catch (error) {
        console.error("Error uploading", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100">
          {uploadProgress}%
        </progress>
      )}
    </div>
  );
};

export default VideoUpload;
