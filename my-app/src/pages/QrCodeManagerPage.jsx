import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

// Import the smaller, focused components
import QrGeneratorForm from '../components/QrGeneratorForm';
import LivePreview from '../components/LivePreview';
import HistoryList from '../components/HistoryList';
import AlertMessage from '../components/QrAlert';

// The main page component that manages state and orchestrates child components.
const QrCodeManagerPage = () => {
    // --- STATE MANAGEMENT ---
    const [link, setLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const API_URL = "http://127.0.0.1:8000/api/v1/qr-generate/";

    // --- HELPERS ---
    const getImageUrl = (path) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        try {
            const base = new URL(API_URL).origin;
            return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
        } catch {
            return path; // Fallback for safety
        }
    };
    
    const placeholderDataUrl = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><rect width='100%' height='100%' fill='#f6fff7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9bbd9c' font-family='Arial' font-size='12'>No Image</text></svg>`);

    // --- DATA FETCHING & API ACTIONS ---
    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || data.message || "Failed to fetch history.");
            }
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!link) return;
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
                throw new Error(result.detail || result.errors?.link?.[0] || "An error occurred.");
            }
            setSuccessMessage("QR code saved successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
            setLink("");
            await fetchHistory();
        } catch (err) {
            setError(err.message);
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
                throw new Error("Failed to delete on the server.");
            }
            setSuccessMessage("QR Code deleted.");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.message);
            setHistory(originalHistory);
        }
    };

    // --- RENDER ---
    return (
        <div style={{ backgroundColor: "#F0FFF4", minHeight: "100vh", padding: "2rem 0", display: "flex", alignItems: "center" }}>
            <Container>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 className="text-center mb-4" style={{ color: "#2F4F4F" }}>QR Code Generatore For Your Restaurant Menu</h1>
                </motion.div>

                <Row className="justify-content-center align-items-center mb-5">
                    <Col md={6}>
                        <QrGeneratorForm
                            link={link}
                            setLink={setLink}
                            handleSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </Col>
                    <Col md={6}>
                        <LivePreview link={link} />
                    </Col>
                </Row>

                <AnimatePresence>
                    {successMessage && <AlertMessage variant="success" message={successMessage} setMessage={setSuccessMessage} />}
                    {error && <AlertMessage variant="danger" message={error} setMessage={setError} />}
                </AnimatePresence>
                
                <HistoryList
                    isLoading={isLoadingHistory}
                    history={history}
                    handleDelete={handleDelete}
                    getImageUrl={getImageUrl}
                    placeholderDataUrl={placeholderDataUrl}
                />
            </Container>
        </div>
    );
};

export default QrCodeManagerPage;

