import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  fetchProducts,
  updateProduct,
  createProduct,
  deleteProduct
} from '../../api/products';
import fallbackImage from '../../assets/logo192.png';
import ProductModal from '../../components/ProductModal';

import {
  Container,
  Dropdown,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductsList = () => {
  const observer = useRef();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleSave = async (productData) => {
    if (typeof productData?.price === 'string')
      productData.price = Number(productData?.price);
    if (editingProduct) {
      delete productData.sku;
      delete productData.stock;
    }
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setProducts((prev) => [
          ...prev.filter((p) => p.id !== productData.id),
          productData
        ]);
      } else {
        await createProduct(productData);
        setProducts((prev) => [
          ...prev.filter((p) => p.id !== productData.id),
          productData
        ]);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteProduct(id); // Adjust API function for deletion
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getProducts = useCallback(async (page) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts({ page });

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data]);
      }
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts(page);
  }, [page, getProducts]);

  const lastProductCallback = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleImageError = (event) => {
    event.target.src = fallbackImage; // Fallback to default image
  };

  if (error)
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Products</h1>
      <div className="text-end mb-4">
        <Button onClick={() => handleAddNew()}>Add New Product </Button>
      </div>
      <Row>
        {products.map((product, index) => (
          <Col
            key={product.sku}
            ref={products.length === index + 1 ? lastProductCallback : null}
            md={3} // Adjust for 4 columns in a row
            className="mb-4"
          >
            <Card className="h-100">
              <Link to={`/products/${product?.id}`}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.title}
                  onError={handleImageError}
                  style={{ objectFit: 'cover', width: '100%', height: '200px' }} // Make sure image fits the card
                />
              </Link>
              <Card.Body className="text-center">
                <Link
                  to={`/products/${product?.id}`}
                  className="link-underline-dark"
                >
                  <Card.Title>{product.title}</Card.Title>
                </Link>
                <Card.Text>Price: ${product.price}</Card.Text>
                {product.stock > 0 ? (
                  <Card.Text className="text-success">
                    In Stock: {product.stock}
                  </Card.Text>
                ) : (
                  <Card.Text className="text-danger">Out of Stock</Card.Text>
                )}
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    ...
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(product)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleRemove(product.id)}
                      style={{ color: 'red' }}
                    >
                      Remove
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status" />
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </Container>
  );
};

export default ProductsList;
