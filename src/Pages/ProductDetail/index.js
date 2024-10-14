import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../api/products'; // Replace with your actual API function
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProductDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id); // Replace with your actual API call
        setProduct(data);
      } catch (error) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    getProductDetail();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="my-4">
      <Card>
        <Card.Img variant="top" src={product.image} alt={product.title} />
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>
            <strong>Price:</strong> ${product.price}
          </Card.Text>
          <Card.Text>
            <strong>Stock:</strong>{' '}
            {product.stock > 0 ? product.stock : 'Out of Stock'}
          </Card.Text>
          <Card.Text>{product.description}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetail;
