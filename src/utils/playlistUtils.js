export const filterPlaylists = (playlists, keyword) => {
  if (!keyword) return playlists;
  const lower = keyword.toLowerCase();
  return playlists.filter(item =>
    item.play_name.toLowerCase().includes(lower) ||
    item.play_genre.toLowerCase().includes(lower) ||
    item.play_description.toLowerCase().includes(lower)
  );
};
