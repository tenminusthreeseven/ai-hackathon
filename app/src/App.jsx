import { useState, useRef } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start the camera
  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Camera access denied or not supported.");
      setCameraActive(false);
    }
  };

  // Capture a photo from the camera
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);

    // Stop the camera
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setCameraActive(false);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4 relative">

      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full"></div>

      {/* Main Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-lg text-center relative z-10">

        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          AI Image Recognition
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Upload an image or take a photo directly from your camera. This demo recognizes objects, scenes, labels, faces, and more.
        </p>

        {/* Upload & Camera Options */}
        {!cameraActive && (
          <div className="flex flex-col gap-4">
            {/* Upload Image */}
            <label className="flex flex-col items-center justify-center border border-gray-500/40 border-dashed rounded-xl p-6 cursor-pointer hover:bg-white/5 transition">
              <span className="text-gray-300 mb-2">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>

            {/* Open Camera */}
            <button
              onClick={startCamera}
              className="flex flex-col items-center justify-center border border-gray-500/40 rounded-xl p-6 cursor-pointer hover:bg-white/5 transition text-gray-300"
            >
              Take Photo
            </button>
          </div>
        )}

        {/* Camera Preview */}
        {cameraActive && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <video ref={videoRef} className="w-full rounded-lg shadow-lg" />
            <button
              onClick={takePhoto}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition font-semibold shadow-lg"
            >
              Capture Photo
            </button>
          </div>
        )}

        {/* Hidden canvas for capturing photo */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Preview section */}
        {image && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Preview</h2>
            <img src={image} alt="preview" className="w-full rounded-lg shadow-lg" />
          </div>
        )}

        {/* Analyze Button */}
        <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition font-semibold shadow-lg">
          Analyze Image
        </button>
      </div>
    </div>
  );
}
