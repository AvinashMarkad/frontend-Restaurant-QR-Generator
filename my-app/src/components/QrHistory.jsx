import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

// The main component that will be rendered
const App = () => {
    return <HistoryOfQR />;
}

// Component to display the history of generated QR codes
const HistoryOfQR = () => {
    // State management
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // For delete success

    const API_URL = "http://127.0.0.1:8000/api/v1/qr-generate/";

    // --- Fetch QR History on Component Mount ---
    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                const result = await response.json(); // Always parse the JSON

                if (!response.ok) {
                    throw new Error(result.message || 'Could not fetch history.');
                }
                
                // --- Updated logic for new API response ---
                // We are assuming the GET list view will also be updated to return a structured response.
                // If it returns a simple array, this will need adjustment.
                // For now, let's prepare for a structured response for consistency.
                if (Array.isArray(result)) {
                    // Fallback for old API that returns a simple array
                     setHistory(result);
                } else if (result && Array.isArray(result.results)) {
                    // Handle Django REST Framework's paginated response
                    setHistory(result.results);
                }
                else {
                    throw new Error("Invalid data format received from server.");
                }

            } catch (err) {
                console.error("Failed to fetch QR history:", err);
                setError(err.message || "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // --- Handle Deleting a QR Code ---
    const handleDelete = async (id) => {
        const originalHistory = [...history];
        setHistory(history.filter(item => item.id !== id)); // Optimistic UI update

        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: 'DELETE',
            });

            // Even for a 204 No Content, response.ok will be true.
            // We don't need to parse a body for a successful delete.
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to delete on the server.');
            }
            
            // Show a success message on successful deletion
            setSuccessMessage("QR Code deleted successfully.");
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            console.error("Deletion failed:", err);
            setError(err.message);
            setHistory(originalHistory); // Revert on failure
        }
    };

    // Animation variants for the cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    };

    return (
        <div style={{ backgroundColor: '#F0FFF4', minHeight: '100vh', padding: '2rem 0' }}>
            <Container>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-center mb-5" style={{ color: '#2F4F4F' }}>QR Code History</h1>
                </motion.div>
                
                {/* --- ALERTS SECTION --- */}
                <div className="mb-3">
                     <AnimatePresence>
                        {successMessage && (
                             <motion.div initial={{ opacity: 0}} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                 <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                                     {successMessage}
                                 </Alert>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {isLoading && (
                    <div className="text-center">
                        <Spinner animation="border" variant="success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}
                
                <Row>
                    <AnimatePresence>
                        {!isLoading && history.length > 0 ? (
                            history.map((item) => (
                                <Col md={6} lg={4} key={item.id} className="mb-4">
                                    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" layout>
                                        <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                            <Card.Img variant="top" src={item.qr_code} alt={`QR Code for ${item.link}`} style={{ objectFit: 'cover', padding: '1rem', background: '#ffffff' }} />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Text as="div" className="text-muted small text-truncate mb-2">
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
                                                </Card.Text>
                                                <Card.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    Created: {new Date(item.created_at).toLocaleString()}
                                                </Card.Text>
                                                <Button variant="outline-danger" size="sm" className="mt-auto align-self-start" onClick={() => handleDelete(item.id)} style={{ borderRadius: '8px' }}>
                                                    Delete
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))
                        ) : (
                           !isLoading && !error && <p className="text-center text-muted">No QR codes found in history.</p> 
                        )}
                    </AnimatePresence>
                </Row>
            </Container>
        </div>
    );
};

export default App;

