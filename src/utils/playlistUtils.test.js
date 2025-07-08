import { filterPlaylists } from './playlistUtils';

const mockData = [
  { play_name: 'Rock Music', play_genre: 'music', play_description: 'Loud and energetic' },
  { play_name: 'Educational Video', play_genre: 'education', play_description: 'Learning React' }
];

test('should return filtered playlist by name', () => {
  const result = filterPlaylists(mockData, 'rock');
  expect(result).toHaveLength(1);
  expect(result[0].play_name).toBe('Rock Music');
});

test('should return all when keyword is empty', () => {
  const result = filterPlaylists(mockData, '');
  expect(result).toHaveLength(2);
});
