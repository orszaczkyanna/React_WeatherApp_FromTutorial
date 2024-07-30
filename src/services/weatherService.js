import { DateTime } from "luxon";

// https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Fetch weather data from the OpenWeatherMap API
const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
    .then((res) => res.json())
    .catch((err) => console.error(err));
};

// Create URL from icon code
const iconUrlFromCode = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

// Convert Unix timestamp to formatted local time
const formatToLocalTime = (
  secs, // alap Unix időbélyeg másodpercekben (dt)
  offset, // időzóna eltolódása másodpercekben (timezone)
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a" // (default fomrat) e.g., Tuesday, 14 May 2024 | Local time: 07:21 AM
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

// Destructure and format weather data from API response
const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt, // current datetime, when the data was fetched (in epoch time) (in seconds)
    sys: { country, sunrise, sunset },
    weather, // array
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0]; // main: details <- rename "main" to "details"
  const formattedLocalTime = formatToLocalTime(dt, timezone); // format = default fomrat

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"), // e.g, 05:33 AM
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"), // e.g, 08:33 PM
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocalTime, // e.g., Tuesday, 14 May 2024 | Local time: 07:21 AM
    dt,
    timezone,
  };
};

// Fetch and apply formatting
const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);
  // ).then((data) => formatCurrent(data));

  return { ...formattedCurrentWeather }; // return the formatted weather data object
  // e.g., {lat: 52.5244, lon: 13.4105, temp: 299.33, feels_like: 299.33, temp_min: 298.14, …}
};

export default getFormattedWeatherData;
