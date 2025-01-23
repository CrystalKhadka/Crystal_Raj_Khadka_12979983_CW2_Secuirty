import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const transactionId = queryParams.get('transaction_id');

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 5,
        bgcolor: 'grey.100',
      }}>
      <Card
        elevation={5}
        sx={{ maxWidth: 400 }}>
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CheckCircleIcon
              color='success'
              sx={{ fontSize: 80 }}
            />
          </Box>

          <Typography
            variant='h4'
            component='h1'
            color='primary'
            align='center'
            fontWeight='bold'
            gutterBottom>
            Payment Successful!
          </Typography>

          <Typography
            variant='body1'
            color='text.secondary'
            align='center'
            sx={{ mb: 4 }}>
            Thank you for your adoption payment. Your transaction was
            successful.
          </Typography>

          {transactionId && (
            <Alert
              severity='info'
              sx={{
                mb: 4,
                py: 1,
                display: 'flex',
                justifyContent: 'center',
              }}>
              <Typography variant='body2'>
                Transaction ID: {transactionId}
              </Typography>
            </Alert>
          )}

          <Button
            component={Link}
            to='/tickets'
            variant='contained'
            size='large'
            fullWidth
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
            View Tickets
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
