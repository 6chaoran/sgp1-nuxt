export function useGeoDistance() {
  const toRad = (x) => (x * Math.PI) / 180;

  const haversineDistance = (lat1, lon1, lat2, lon2, unit = "km") => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let dist = R * c; // in km
    if (unit === "m") dist *= 1000; // convert to meters
    if (unit === "mi") dist *= 0.621371; // convert to miles

    return dist;
  };

  return {
    haversineDistance,
  };
}
