const STORAGE_KEY = 'weather_favorites';

export const getFavorites = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const toggleFavorite = (cityName) => {
  let favs = getFavorites();
  if (favs.includes(cityName)) {
    favs = favs.filter(f => f !== cityName);
  } else {
    favs = [...favs, cityName];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return favs;
};