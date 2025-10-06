import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: result.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    
    setLoading(false);
  };

  return (
    <Container maxW="md" py={12}>
      <Center>
        <Box
          p={8}
          maxWidth="400px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={4} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="brand.500">
                💰 Budget Tracker
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Sign in to your account
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.500"
                  color="white"
                  width="full"
                  isLoading={loading}
                  loadingText="Signing in..."
                  _hover={{
                    bg: 'brand.600',
                  }}
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Box textAlign="center">
              <Text>
                Don't have an account?{' '}
                <Link as={RouterLink} to="/signup" color="brand.500">
                  Sign up
                </Link>
              </Text>
            </Box>
          </VStack>
        </Box>
      </Center>
    </Container>
  );
};

export default Login;
