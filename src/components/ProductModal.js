import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const ProductModal = ({ show, onHide, onSave, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    image: '',
    price: '',
    stock: '',
    description: ''
  });
  const [error, setError] = useState(null);

  const resetData = () => {
    setFormData({
      title: '',
      sku: '',
      image: '',
      price: '',
      stock: '',
      description: ''
    });
  };

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        sku: product.sku || '',
        image: product.image || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || ''
      });
    } else {
      resetData();
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Check if required fields are filled for adding a product
    if (
      !formData.title ||
      !formData.sku ||
      !formData.image ||
      !formData.price
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    onSave(formData);
    onHide();
    resetData();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {product ? 'Edit Product' : 'Add New Product'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSku">
            <Form.Label>SKU</Form.Label>
            <Form.Control
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter product SKU"
              disabled={!!product} // Disable SKU field if editing
            />
            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter product stock"
              />
            </Form.Group>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter product price"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description (optional)"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {product ? 'Save Changes' : 'Add Product'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
