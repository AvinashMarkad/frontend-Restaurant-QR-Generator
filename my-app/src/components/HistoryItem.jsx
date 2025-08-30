import { Col, Card, Button } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// This component represents a single card in the history grid.
const HistoryItem = ({ item, handleDelete, getImageUrl, placeholderDataUrl }) => {
    const imageUrl = getImageUrl(item.qr_code);

    // Function to download QR code
    const downloadQR = () => {
        const link = document.createElement("a");
        link.href = imageUrl || placeholderDataUrl;
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); 
        link.download = `qr_${timestamp}.png`; // auto timestamped file name
        link.click();
    };

    return (
        <Col md={6} lg={4} className="mb-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.8 }} 
                layout
            >
                <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
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
                        
                        {/* Buttons Row */}
                        <div className="d-flex gap-2 mt-auto ">
                            <Button 
                                variant="outline-success m-1" 
                                size="sm" 
                                onClick={downloadQR}
                            >
                                Download
                            </Button>
                            <Button 
                                variant="outline-danger m-1" 
                                size="sm" 
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </motion.div>
        </Col>
    );
};

export default HistoryItem;
