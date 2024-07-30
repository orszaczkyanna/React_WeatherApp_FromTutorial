import { DateTime } from "luxon";

// https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
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

// Format forecast data to provide hourly and daily details
const formatForecastWeather = (secs, offset, data) => {
  // hourly
  const hourly = data // data = d.list
    .filter((f) => f.dt > secs) // csak jövőbeli időpontokat adjon
    .slice(0, 5) // az első 5 elemet tartsa meg
    .map((f) => ({
      // formázás
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt, // "2024-07-30 21:00:00"
    }));

  // daily
  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === "00:00:00") // dt_txt: "2024-07-31 00:00:00"
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"), //  title: "Wed"
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

// Fetch and apply formatting
const getFormattedWeatherData = async (searchParams) => {
  // current weather
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);
  // ).then((data) => formatCurrent(data));

  // forecast
  const { dt, lat, lon, timezone } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData(
    "forecast", // forecast endpoint
    { lat, lon, units: searchParams.units }
  ).then((d) => formatForecastWeather(dt, timezone, d.list));

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
  // return the formatted weather and forecast data object
  // e.g., {lat: 52.5244, lon: 13.4105, temp: 21.34, feels_like: 21.33, temp_min: 19.03, …}
};

export default getFormattedWeatherData;
