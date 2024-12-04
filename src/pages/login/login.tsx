"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User } from '@/types/schema/user';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthService from "@/auth/auth.service";

import {
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
  Box,
  IconButton,
} from '@mui/material';

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams(); // useSearchParams instead of useRouter
  const auth: AuthService = new AuthService();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data: User = { username, password, rememberMe };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const response = await auth.login(data);
      if (response) {
        const redirectPath = searchParams?.get('redirect') || '/analytics';
        window.location.replace(redirectPath);
      } else {
        setError('Account Not Verified !! Contact Admin');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
          <Image
            alt="logo"
            height={50}
            width={110}
            className="hidden md:block cursor-pointer"
            src="/logo.png"
          />
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <TextField
            margin="normal"
            label="Username"
            size="small"
            variant="filled"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            size="small"
            variant="filled"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
