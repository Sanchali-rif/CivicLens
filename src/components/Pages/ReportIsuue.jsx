import React, { useState, useEffect, useRef } from "react";
import "./ReportIssue.css";
import { toast } from "react-toastify";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";

// ✅ Render backend base URL
const BACKEND_URL = "https://civiclens-backend-exjz.onrender.com";

const defaultCenter = {
  lat: 22.5726,
  lng: 88.3639,
};

const libraries = ["places"];

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
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [address, setAddress] = useState("");

  const autocompleteRef = useRef(null);

  const reverseGeocode = (lat, lng) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setMapCenter(userLocation);
        setMarkerPosition(userLocation);
        reverseGeocode(userLocation.lat, userLocation.lng);
      },
      () => {
        console.warn("User denied location, using default city");
      }
    );
  }, []);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMapCenter(location);
    setMarkerPosition(location);
    setAddress(place.formatted_address || "");
  };

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

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);
      formData.append("user_id", 1);

      if (!locationNotSure && markerPosition) {
        formData.append("lat", markerPosition.lat);
        formData.append("lng", markerPosition.lng);
        formData.append("address", address);
      }

      const res = await fetch(
        `${BACKEND_URL}/upload_issue.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Upload failed");
      } else {
        toast.success("Issue submitted successfully");
        console.log("SERVER RESPONSE:", data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImage(null);
    setImagePreview(null);
    setDescription("");
    setMarkerPosition(null);
    setLocationNotSure(false);
    setAddress("");
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
                <span className="upload-sub-text">PNG or JPG, max 5MB</span>
              </label>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Additional details (optional)</label>
          <textarea
            className="description-input"
            rows="4"
            placeholder="Describe The Issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location of the issue</label>

          <Autocomplete
            onLoad={(auto) => (autocompleteRef.current = auto)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              className="location-search"
              placeholder="Search location"
              disabled={locationNotSure}
            />
          </Autocomplete>

          <div className="map-wrapper">
            <GoogleMap
              mapContainerClassName="map-container"
              center={mapCenter}
              zoom={14}
              options={{
                disableDefaultUI: false,
                clickableIcons: false,
              }}
              onClick={(e) => {
                if (locationNotSure) return;

                const clickedLocation = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                };

                setMarkerPosition(clickedLocation);
                setMapCenter(clickedLocation);
                reverseGeocode(clickedLocation.lat, clickedLocation.lng);
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

          {!locationNotSure && markerPosition && (
            <div className="location-coordinates">
              <strong>Selected Location:</strong>
              <p>
                <b>Address:</b>{" "}
                {address ? address : "Fetching address..."}
              </p>
              <p>Latitude: {markerPosition.lat.toFixed(6)}</p>
              <p>Longitude: {markerPosition.lng.toFixed(6)}</p>
            </div>
          )}

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={locationNotSure}
              onChange={() => {
                const value = !locationNotSure;
                setLocationNotSure(value);
                if (value) setAddress("");
              }}
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
