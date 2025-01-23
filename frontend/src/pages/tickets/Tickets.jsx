import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { getBookingsByUserApi } from '../../apis/Api';

const StyledTicketNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  left: -15,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getBookingsByUserApi()
      .then((res) => {
        const sortedTickets = res.data.tickets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTickets(sortedTickets);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const groupTicketsByDate = (tickets) => {
    const groups = {};
    tickets.forEach((ticket) => {
      const date = new Date(ticket.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(ticket);
    });
    return groups;
  };

  const groupedTickets = groupTicketsByDate(tickets);

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 10 }}>
        <Typography
          variant='h4'
          gutterBottom>
          My Tickets
        </Typography>
        {tickets.length === 0 ? (
          <Typography variant='body1'>No tickets available</Typography>
        ) : (
          Object.entries(groupedTickets).map(([date, dateTickets]) => (
            <Box
              key={date}
              sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                sx={{ mb: 2 }}>
                {date}
              </Typography>
              <Grid
                container
                spacing={3}>
                {dateTickets.map((ticket, index) => {
                  const { show, seats, user, price } = ticket;
                  const { movieId, showDate, showTime } = show;
                  const { movieName } = movieId;

                  return (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={ticket._id}>
                      <Paper
                        elevation={3}
                        sx={{ position: 'relative' }}>
                        <StyledTicketNumber>{index + 1}</StyledTicketNumber>
                        <Card>
                          <CardHeader
                            title={movieName}
                            subheader={`${new Date(
                              showDate
                            ).toLocaleDateString()} at ${showTime}`}
                            action={
                              <QRCodeSVG
                                value={`Ticket ID: ${ticket._id}`}
                                size={64}
                              />
                            }
                          />
                          <CardContent>
                            <Grid
                              container
                              spacing={2}>
                              <Grid
                                item
                                xs={12}
                                sm={6}>
                                <Typography variant='h6'>Seats</Typography>
                                {seats.length > 0 ? (
                                  <List dense>
                                    {seats.map((seat) => (
                                      <ListItem key={seat._id}>
                                        Seat Number: {seat.seatNo}
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography>No seats selected</Typography>
                                )}
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={6}>
                                <Typography variant='h6'>
                                  User Information
                                </Typography>
                                <Typography>
                                  Username: {user.username}
                                </Typography>
                                <Typography>Email: {user.email}</Typography>
                                <Typography>
                                  Phone: {user.phoneNumber}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                              <Typography variant='h6'>
                                Price: Rs.{price}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Tickets;
