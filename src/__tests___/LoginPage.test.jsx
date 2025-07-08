import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/Login'; // Pastikan path sesuai: './Login' = src/pages/Login/index.jsx

describe('LoginPage Unit Tests', () => {
  test('Login berhasil memanggil setIsAuthenticated', () => {
    const mockSetIsAuthenticated = jest.fn();

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <LoginPage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByRole('button', { name: /sign in/i });

    // Simulasi input yang valid
    fireEvent.change(emailInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });

    // Klik login
    fireEvent.click(loginButton);

    // Validasi berhasil login
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
  });

  test('Login gagal menampilkan alert dan tidak memanggil setIsAuthenticated', () => {
    const mockSetIsAuthenticated = jest.fn();
    window.alert = jest.fn(); // Supaya tidak muncul popup asli

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <LoginPage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByRole('button', { name: /sign in/i });

    // Simulasi input yang salah
    fireEvent.change(emailInput, { target: { value: 'user' } });
    fireEvent.change(passwordInput, { target: { value: 'salah123' } });

    // Klik login
    fireEvent.click(loginButton);

    // Validasi: alert muncul dan tidak login
    expect(window.alert).toHaveBeenCalledWith('Login gagal');
    expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
  });
});
