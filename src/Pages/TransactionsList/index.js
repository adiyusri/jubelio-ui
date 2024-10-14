import React, { useEffect, useState } from 'react';
import {
  fetchTransactions,
  updateTransaction,
  createTransaction,
  deleteTransaction
} from '../../api/transactions';
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form
} from 'react-bootstrap';

const TransactionsList = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({
    id: '',
    sku: '',
    qty: '',
    amount: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    const getAdjustments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTransactions();
        setAdjustments(data);
      } catch (error) {
        setError('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    getAdjustments();
  }, []);

  const handleShowModal = (transaction = {}, viewOnly = false) => {
    setCurrentTransaction({
      id: transaction.id || '',
      sku: transaction.sku || '',
      qty: transaction.qty || '',
      amount: transaction.amount || ''
    });
    setIsViewing(viewOnly);
    setIsEditing(!!transaction.id && !viewOnly);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTransaction({ id: '', sku: '', qty: '', amount: '' });
    setIsViewing(false);
    setIsEditing(false);
  };

  const handleSaveTransaction = async () => {
    try {
      delete currentTransaction.amount;
      if (isEditing) {
        const id = currentTransaction.id;
        delete currentTransaction.id;
        await updateTransaction(id, currentTransaction);
      } else {
        delete currentTransaction.id;
        await createTransaction(currentTransaction);
      }
      setShowModal(false);
      const data = await fetchTransactions();
      setAdjustments(data);
    } catch (error) {
      setError('Error saving transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      const data = await fetchTransactions();
      setAdjustments(data);
    } catch (error) {
      setError('Error deleting transaction');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="my-4">
      <h1 className="mb-4">Transactions</h1>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleShowModal()}
      >
        Add New Transaction
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map((adjustment) => (
            <tr key={adjustment.id}>
              <td>{adjustment.id}</td>
              <td>{adjustment.sku}</td>
              <td>{adjustment.qty}</td>
              <td>{adjustment.amount}</td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => handleShowModal(adjustment, true)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleShowModal(adjustment)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTransaction(adjustment.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit/View */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isViewing ? 'View' : isEditing ? 'Edit' : 'Add'} Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTransactionId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                value={currentTransaction.id}
                disabled
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTransactionSKU">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                value={currentTransaction.sku}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    sku: e.target.value
                  })
                }
                disabled={isViewing}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTransactionQty">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={currentTransaction.qty}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    qty: e.target.value
                  })
                }
                disabled={isViewing}
              />
            </Form.Group>
            {isViewing && (
              <Form.Group className="mb-3" controlId="formTransactionQty">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={currentTransaction.amount}
                  disabled={isViewing}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {!isViewing && (
            <Button variant="primary" onClick={handleSaveTransaction}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransactionsList;
