import { useState, useEffect } from "react";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";

const App = () => {
  const [query, setQuery] = useState({ q: "london" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather();
  }, [query, units]);

  const getWeather = async () => {
    await getFormattedWeatherData({ ...query, units }).then((data) => {
      setWeather(data);
      // console.log(data);
    });
  };

  // Make the background color dynamic based on the temperature
  const formatBackground = () => {
    if (!weather) {
      return "from-cyan-600 to-blue-700";
    }

    const treshold = units === "metric" ? 20 : 60;
    if (weather.temp <= treshold) {
      return "from-cyan-600 to-blue-700";
    } else {
      return "from-yellow-600 to-orange-700";
    }
  };

  return (
    <div
      className={`mx-auto max-w-screen-lg mt-4 py-5 px-32
      bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />

      {/* Show them only if weather data is available */}
      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} units={units} />
          <Forecast title="3 hour step forecast" data={weather.hourly} />
          <Forecast title="daily forecast" data={weather.daily} />
        </>
      )}
    </div>
  );
};

export default App;
