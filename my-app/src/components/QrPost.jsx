import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// This single component now manages generating, displaying, and deleting QR codes.
const QrCodeManager = () => {
  // --- STATE MANAGEMENT ---
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/v1/qr-generate/";

  // Helper: return absolute image URL for the qr_code field
  const getImageUrl = (path) => {
    if (!path) return null;

    // If it's already an absolute URL, return it
    if (/^https?:\/\//i.test(path)) return path;

    // Otherwise, build absolute using API_URL origin
    try {
      const base = new URL(API_URL).origin; // e.g. "http://127.0.0.1:8000"
      // Ensure single slash between base and path
      return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    } catch {
      // Fallback to window.location origin if URL parsing fails
      const base = typeof window !== "undefined" ? window.location.origin : "";
      return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    }
  };

  // --- DATA FETCHING ---
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to fetch QR code history.");
      }

      // Ensure we store an array (DRF list view should return an array)
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch QR code history.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- API ACTIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!link) {
      setError("Please enter a link before submitting.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || result.errors?.link?.[0] || result.message || "An error occurred.");
      }

      // On success the DRF ListCreateAPIView returns the created object.
      setSuccessMessage("QR saved.");
      setTimeout(() => setSuccessMessage(null), 2500);
      setLink(""); // Clear input
      await fetchHistory(); // Refresh the history list
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to save QR code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const originalHistory = [...history];
    setHistory(history.filter((item) => item.id !== id));

    try {
      const response = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!response.ok) {
        // try reading error body if any
        let body = {};
        try {
          body = await response.json();
        } catch {
          // Intentionally left blank: ignore JSON parse errors
        }
        throw new Error(body.detail || "Failed to delete on the server.");
      }
      setSuccessMessage("QR Code deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete QR code.");
      setHistory(originalHistory);
    }
  };

  // small placeholder for image fallback
  const placeholderDataUrl =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><rect width='100%' height='100%' fill='#f6fff7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9bbd9c' font-family='Arial' font-size='12'>No Image</text></svg>`
    );

  return (
    <div style={{ backgroundColor: "#F0FFF4", minHeight: "100vh", padding: "2rem 0", display: "flex", alignItems: "center" }}>
      <Container>
        {/* --- HEADER --- */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-center mb-4" style={{ color: "#2F4F4F" }}>
            QR Code Manager
          </h1>
        </motion.div>

        <Row className="justify-content-center align-items-center mb-5">
          {/* --- QR GENERATOR FORM --- */}
          <Col md={6}>
            <Card className="shadow-sm border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter URL to Create QR Code</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://example.com"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      required
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="success" type="submit" disabled={isSubmitting || !link} style={{ backgroundColor: "#2E8B57", borderColor: "#2E8B57", borderRadius: "10px" }}>
                      {isSubmitting ? (
                        <>
                          <Spinner as="span" size="sm" /> Saving...
                        </>
                      ) : (
                        "Save QR Code"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* --- LIVE PREVIEW SECTION --- */}
          <Col md={6} className="text-center mt-4 mt-md-0">
            <AnimatePresence>
              {link && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <h5 className="text-muted mb-3">Live Preview</h5>
                  <div className="p-3 bg-white d-inline-block shadow-sm" style={{ borderRadius: "15px" }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(link)}`} alt="Live QR Code Preview" width="160" height="160" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Col>
        </Row>

        {/* --- ALERTS --- */}
        <AnimatePresence>
          {successMessage && <AlertMessage variant="success" message={successMessage} setMessage={setSuccessMessage} />}
          {error && <AlertMessage variant="danger" message={error} setMessage={setError} />}
        </AnimatePresence>

        {/* --- HISTORY SECTION --- */}
        <hr />
        <h2 className="text-center my-4" style={{ color: "#2F4F4F" }}>
          Saved QR Codes
        </h2>

        {isLoadingHistory && (
          <div className="text-center">
            <Spinner animation="border" variant="success" />
          </div>
        )}

        <Row>
          <AnimatePresence>
            {!isLoadingHistory &&
              history.map((item) => {
                const imageUrl = getImageUrl(item.qr_code);
                return (
                  <Col md={6} lg={4} key={item.id} className="mb-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} layout>
                      <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                        {/* QR IMAGE ON TOP */}
                        <div className="text-center bg-white p-3">
                          <img
  src={imageUrl || placeholderDataUrl}
  alt={`QR Code for ${item.link}`}
  style={{ width: "150px", height: "150px", objectFit: "contain" }}
  onError={(e) => { e.currentTarget.src = placeholderDataUrl }}
/>

                        </div>

                        <Card.Body className="d-flex flex-column">
                          <Card.Text as="div" className="text-muted small text-truncate mb-2">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.link}
                            </a>
                          </Card.Text>
                          <Card.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Created: {new Date(item.created_at).toLocaleString()}
                          </Card.Text>
                          <Button variant="outline-danger" size="sm" className="mt-auto align-self-start" onClick={() => handleDelete(item.id)}>
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
          </AnimatePresence>
        </Row>
        {!isLoadingHistory && history.length === 0 && <p className="text-center text-muted">No saved QR codes found.</p>}
      </Container>
    </div>
  );
};

// Helper component for animated alerts with icons
const AlertMessage = ({ variant, message, setMessage }) => {
  const icons = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    danger: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" x2="12" y1="9" y2="13"></line>
        <line x1="12" x2="12.01" y1="17" y2="17"></line>
      </svg>
    ),
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Alert variant={variant} onClose={() => setMessage(null)} dismissible className="d-flex align-items-center">
        {icons[variant]}
        {message}
      </Alert>
    </motion.div>
  );
};

export default QrCodeManager;
