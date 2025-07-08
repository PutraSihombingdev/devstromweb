import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaylistPage from './PlaylistPage';

test('should show error when submitting empty form', async () => {
  render(<PlaylistPage />);
  await userEvent.click(screen.getByTestId('add-playlist-button')); // klik tombol tambah

  const submitBtn = screen.getByText(/submit/i);
  await userEvent.click(submitBtn); // klik tombol submit

  // cek bahwa muncul 5 pesan error karena field kosong
  expect(await screen.findAllByText(/please input/i)).toHaveLength(5);
});
