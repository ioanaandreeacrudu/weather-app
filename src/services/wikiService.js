/**
 * @file wikiService.js
 * @description Serviciu de integrare cu Wikipedia API pentru context vizual dinamic.
 * @author Vornicu Denisa Ștefania
 * @contribution [CONTRIBUȚIE SUPLIMENTARĂ] Preluarea imaginilor reprezentative pentru orașele căutate.
 */

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