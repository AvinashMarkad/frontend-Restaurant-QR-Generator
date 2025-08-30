import React from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';

// This component is only responsible for the QR code creation form.
const QrGeneratorForm = ({ link, setLink, handleSubmit, isSubmitting }) => {
    return (
        <Card className="shadow-sm border-0" style={{ borderRadius: "15px" }}>
            <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter URL to Create QR Code For Your Restaurant Menu</Form.Label>
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
                                <><Spinner as="span" size="sm" /> Saving...</>
                            ) : (
                                "Save QR Code"
                            )}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default QrGeneratorForm;
