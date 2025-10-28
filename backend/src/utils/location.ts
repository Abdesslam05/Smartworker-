import fetch from 'node-fetch';
import { env } from '../config/env';

export interface Coordinates {
  lat: number;
  lng: number;
}

export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  if (!env.googleMapsApiKey) {
    return null;
  }

  const params = new URLSearchParams({ address, key: env.googleMapsApiKey });
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as any;
  const result = data.results?.[0];
  if (!result) {
    return null;
  }
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  };
};

export const haversineDistanceKm = (from: Coordinates, to: Coordinates): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
