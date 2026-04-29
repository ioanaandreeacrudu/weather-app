import axios from 'axios';

export async function fetchCityImage(cityName) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
    const { data } = await axios.get(url);
    return data.thumbnail ? data.thumbnail.source : null;
  } catch (error) {
    return null; // Fallback dacă nu găsește orașul
  }
}