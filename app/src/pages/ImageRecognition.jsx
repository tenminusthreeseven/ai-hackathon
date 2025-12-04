import { useState } from "react";

export default function ImageRecognition() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);

  // handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // send image to AWS backend
  const analyzeImage = async () => {
    if (!image) return alert("Please upload an image first!");

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("https://your-backend-url/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResults(data.labels || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">
        AWS Image Recognition
      </h1>

      {/* Upload box */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-6"
      />

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-64 h-64 object-cover rounded-lg shadow-md mb-6"
        />
      )}

      {/* Analyze Button */}
      <button
        onClick={analyzeImage}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Analyze Image
      </button>

      {/* Results */}
      <div className="mt-8 w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Results:</h2>

        {results.length === 0 ? (
          <p className="text-gray-500">No results yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {results.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
