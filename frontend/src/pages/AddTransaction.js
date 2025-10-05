import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Gift',
    'Other Income',
  ];

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Other Expenses',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
      };

      await axios.post('/transactions', transactionData);

      toast({
        title: 'Transaction added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/transactions');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add transaction',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" color="brand.500">
              Add New Transaction
            </Heading>
            <Text color="gray.600">
              Record your income or expense
            </Text>
          </Box>

          <Box
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Select transaction type"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select category"
                  >
                    {formData.type === 'income' ? (
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

                <FormControl isRequired>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description (Optional)</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add a description..."
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} width="full">
                  <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={loading}
                    loadingText="Adding..."
                  >
                    Add Transaction
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/transactions"
                    variant="outline"
                    width="full"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AddTransaction;
