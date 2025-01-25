import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllLogsApi } from '../../../apis/Api';

const LogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      getAllLogsApi().then((res) => {
        const data = res.data?.logs || [];
        setLogs(data);
      });
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'info':
        return 'info';
      case 'warn':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <Container
      maxWidth='lg'
      sx={{ py: 5, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Typography
        variant='h4'
        component='h1'
        align='center'
        gutterBottom>
        System Logs
      </Typography>
      <Paper
        elevation={1}
        sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            placeholder='Search logs...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant='outlined'
            size='small'
            sx={{ flex: 1 }}
          />
          <FormControl
            size='small'
            sx={{ minWidth: 120 }}>
            <InputLabel>Level</InputLabel>
            <Select
              value={levelFilter}
              label='Level'
              onChange={(e) => setLevelFilter(e.target.value)}>
              <MenuItem value='all'>All</MenuItem>
              <MenuItem value='info'>Info</MenuItem>
              <MenuItem value='warn'>Warning</MenuItem>
              <MenuItem value='error'>Error</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredLogs.length === 0 ? (
          <Alert severity='info'>No logs found</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>IP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow
                    key={log._id}
                    hover>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.level}
                        color={getLevelColor(log.level)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.method || 'N/A'}</TableCell>
                    <TableCell>{log.url || 'N/A'}</TableCell>
                    <TableCell>{log.user || 'N/A'}</TableCell>
                    <TableCell>{log.ip || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default LogManagement;
