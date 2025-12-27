import React, { useState } from "react";
import "./ReportIssue.css";
import { toast } from "react-toastify";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const defaultCenter = {
  lat: 22.5726,
  lng: 88.3639,
};

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

export const ReportIsuue = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [locationNotSure, setLocationNotSure] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image of the issue");
      return;
    }

    if (!locationNotSure && !markerPosition) {
      toast.info("Please select the issue location on the map");
      return;
    }

    setSubmitting(true);

    console.log({
      image,
      description,
      location: locationNotSure ? null : markerPosition,
    });

    toast.success("Issue submitted successfully");
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(null);
    setDescription("");
    setMarkerPosition(null);
    setLocationNotSure(false);
    setSubmitting(false);
  };

  if (loadError) return <p>Map failed to load</p>;
  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <div className="report-container">
      <h1 className="report-title">Report an Issue</h1>
      <p className="report-subtitle">
        Help your city by reporting local hazards
      </p>

      <form className="report-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="form-label">Upload an image of the issue</label>
          <div className="upload-box">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="file-input"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <img src={imagePreview} className="image-preview" />
            ) : (
              <label htmlFor="imageUpload" className="upload-label">
                <p className="upload-main-text">Browse files to upload</p>
                <span className="upload-sub-text">
                  PNG or JPG, max 5MB
                </span>
              </label>
            )}
          </div>
        </div>

        
        <div className="form-group">
          <label className="form-label">Additional details (optional)</label>
          <textarea
            className="description-input"
            rows="4"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        
        <div className="form-group">
          <label className="form-label">Location of the issue</label>

          <div className="map-wrapper">
            <GoogleMap
              mapContainerClassName="map-container"
              center={markerPosition || defaultCenter}
              zoom={14}
              options={{
                disableDefaultUI: false,
                clickableIcons: false,
              }}
              onClick={(e) => {
                if (locationNotSure) return;
                setMarkerPosition({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                });
              }}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>


            {locationNotSure && (
              <div className="map-disabled-overlay">
                Location selection disabled
              </div>
            )}
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={locationNotSure}
              onChange={() => setLocationNotSure(!locationNotSure)}
            />
            <span>I am not sure about the exact location</span>
          </div>
        </div>

        <button className="submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
};

