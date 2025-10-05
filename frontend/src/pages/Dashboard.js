import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  VStack,
  HStack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [currentMonth, user]);

  const fetchDashboardData = async () => {
    try {
      // Get all transactions
      const allTransactionsResponse = await axios.get('/transactions?limit=1000');
      const allTransactions = allTransactionsResponse.data.transactions;

      // Get current month transactions
      const monthlyTransactionsResponse = await axios.get(`/transactions?month=${currentMonth}&limit=1000`);
      const monthlyTransactions = monthlyTransactionsResponse.data.transactions;

      // Calculate totals
      const calculateTotals = (transactions) => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          income,
          expenses,
          balance: income - expenses,
        };
      };

      const allTotals = calculateTotals(allTransactions);
      const monthlyTotals = calculateTotals(monthlyTransactions);

      setStats({
        totalIncome: allTotals.income,
        totalExpenses: allTotals.expenses,
        balance: allTotals.balance,
        monthlyIncome: monthlyTotals.income,
        monthlyExpenses: monthlyTotals.expenses,
        monthlyBalance: monthlyTotals.balance,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
              Welcome back, {user?.name}!
            </Heading>
            <Text color="gray.600">
              Here's an overview of your financial situation
            </Text>
          </Box>

          {/* Quick Actions */}
          <Box>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/add-transaction"
                colorScheme="blue"
                size="lg"
              >
                Add Transaction
              </Button>
              <Button
                as={RouterLink}
                to="/transactions"
                variant="outline"
                size="lg"
              >
                View All Transactions
              </Button>
            </HStack>
          </Box>

          {/* Overall Stats */}
          <Box>
            <Heading size="md" mb={4}>
              Overall Summary
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <GridItem>
                <Stat
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="green.50"
                  borderColor="green.200"
                >
                  <StatLabel>Total Income</StatLabel>
                  <StatNumber color="green.600">
                    {formatCurrency(stats.totalIncome)}
                  </StatNumber>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </GridItem>

              <GridItem>
                <Stat
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="red.50"
                  borderColor="red.200"
                >
                  <StatLabel>Total Expenses</StatLabel>
                  <StatNumber color="red.600">
                    {formatCurrency(stats.totalExpenses)}
                  </StatNumber>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </GridItem>

              <GridItem>
                <Stat
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg={stats.balance >= 0 ? 'blue.50' : 'orange.50'}
                  borderColor={stats.balance >= 0 ? 'blue.200' : 'orange.200'}
                >
                  <StatLabel>Current Balance</StatLabel>
                  <StatNumber color={stats.balance >= 0 ? 'blue.600' : 'orange.600'}>
                    {formatCurrency(stats.balance)}
                  </StatNumber>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </GridItem>
            </Grid>
          </Box>

          {/* Monthly Stats */}
          <Box>
            <Heading size="md" mb={4}>
              This Month ({new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <GridItem>
                <Stat
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="green.50"
                  borderColor="green.200"
                >
                  <StatLabel>Monthly Income</StatLabel>
                  <StatNumber color="green.600">
                    {formatCurrency(stats.monthlyIncome)}
                  </StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </GridItem>

              <GridItem>
                <Stat
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="red.50"
                  borderColor="red.200"
                >
                  <StatLabel>Monthly Expenses</StatLabel>
                  <StatNumber color="red.600">
                    {formatCurrency(stats.monthlyExpenses)}
                  </StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </GridItem>

              <GridItem>
                <Stat
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg={stats.monthlyBalance >= 0 ? 'blue.50' : 'orange.50'}
                  borderColor={stats.monthlyBalance >= 0 ? 'blue.200' : 'orange.200'}
                >
                  <StatLabel>Monthly Balance</StatLabel>
                  <StatNumber color={stats.monthlyBalance >= 0 ? 'blue.600' : 'orange.600'}>
                    {formatCurrency(stats.monthlyBalance)}
                  </StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </GridItem>
            </Grid>
          </Box>

          {/* Tips Section */}
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            bg="gray.50"
            borderColor="gray.200"
          >
            <Heading size="sm" mb={2}>
              💡 Quick Tips
            </Heading>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="gray.600">
                • Add your first transaction to get started
              </Text>
              <Text fontSize="sm" color="gray.600">
                • Review your monthly spending patterns
              </Text>
              <Text fontSize="sm" color="gray.600">
                • Set budget goals for different categories
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
