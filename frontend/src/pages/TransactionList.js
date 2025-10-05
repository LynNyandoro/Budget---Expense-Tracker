import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  VStack,
  HStack,
  Select,
  Input,
  useToast,
  Spinner,
  Center,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: '',
    category: '',
    type: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [filters.month, filters.category, filters.type, pagination.currentPage, user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Only add non-empty filter values
      params.append('page', pagination.currentPage);
      params.append('limit', '10');
      
      if (filters.month) params.append('month', filters.month);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);

      const response = await axios.get(`/transactions?${params}`);
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page when filtering
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await axios.delete(`/transactions/${id}`);
      toast({
        title: 'Transaction deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      date: new Date(transaction.date).toISOString().split('T')[0],
    });
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/transactions/${editingTransaction._id}`, editingTransaction);
      toast({
        title: 'Transaction updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'green' : 'red';
  };

  const incomeCategories = [
    'Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income',
  ];

  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
    'Groceries', 'Other Expenses',
  ];

  if (loading) {
    return (
      <Box>
        <Navbar />
        <Center h="50vh">
          <Spinner size="xl" color="brand.500" />
        </Center>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" color="brand.500">
              All Transactions
            </Heading>
            <Text color="gray.600">
              View and manage your financial transactions
            </Text>
          </Box>

          {/* Filters */}
          <Box
            p={4}
            borderWidth={1}
            borderRadius="lg"
            bg="gray.50"
            borderColor="gray.200"
          >
            <HStack spacing={4} wrap="wrap">
              <FormControl minW="200px">
                <FormLabel fontSize="sm">Filter by Month</FormLabel>
                <Input
                  type="month"
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  placeholder="Select month"
                />
              </FormControl>

              <FormControl minW="200px">
                <FormLabel fontSize="sm">Filter by Type</FormLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  placeholder="All types"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>
              </FormControl>

              <FormControl minW="200px">
                <FormLabel fontSize="sm">Filter by Category</FormLabel>
                <Input
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  placeholder="Enter category"
                />
              </FormControl>

              <Box alignSelf="end">
                <Button
                  as={RouterLink}
                  to="/add-transaction"
                  colorScheme="blue"
                  size="sm"
                >
                  Add Transaction
                </Button>
              </Box>
            </HStack>
          </Box>

          {/* Transactions Table */}
          <Box
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
            bg="white"
          >
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Date</Th>
                  <Th>Type</Th>
                  <Th>Category</Th>
                  <Th>Description</Th>
                  <Th isNumeric>Amount</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((transaction) => (
                  <Tr key={transaction._id}>
                    <Td>{formatDate(transaction.date)}</Td>
                    <Td>
                      <Badge colorScheme={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </Td>
                    <Td>{transaction.category}</Td>
                    <Td>{transaction.description || '-'}</Td>
                    <Td isNumeric>
                      <Text
                        color={transaction.type === 'income' ? 'green.600' : 'red.600'}
                        fontWeight="bold"
                      >
                        {formatCurrency(transaction.amount)}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleEdit(transaction)}
                          aria-label="Edit transaction"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(transaction._id)}
                          aria-label="Delete transaction"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {transactions.length === 0 && (
              <Center py={8}>
                <VStack spacing={4}>
                  <Text color="gray.500">No transactions found</Text>
                  <Button as={RouterLink} to="/add-transaction" colorScheme="blue">
                    Add Your First Transaction
                  </Button>
                </VStack>
              </Center>
            )}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <HStack justify="center" spacing={4}>
              <Button
                size="sm"
                isDisabled={!pagination.hasPrevPage}
                onClick={() => setPagination(prev => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))}
              >
                Previous
              </Button>
              <Text>
                Page {pagination.currentPage} of {pagination.totalPages}
              </Text>
              <Button
                size="sm"
                isDisabled={!pagination.hasNextPage}
                onClick={() => setPagination(prev => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))}
              >
                Next
              </Button>
            </HStack>
          )}
        </VStack>
      </Container>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editingTransaction && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={editingTransaction.type}
                    onChange={(e) => setEditingTransaction(prev => ({
                      ...prev,
                      type: e.target.value,
                    }))}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction(prev => ({
                      ...prev,
                      category: e.target.value,
                    }))}
                  >
                    {editingTransaction.type === 'income' ? (
                      incomeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    ) : (
                      expenseCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction(prev => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))}
                    step="0.01"
                    min="0.01"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction(prev => ({
                      ...prev,
                      date: e.target.value,
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editingTransaction.description || ''}
                    onChange={(e) => setEditingTransaction(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))}
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} width="full">
                  <Button
                    colorScheme="blue"
                    onClick={handleUpdate}
                    width="full"
                  >
                    Update Transaction
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    width="full"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionList;
