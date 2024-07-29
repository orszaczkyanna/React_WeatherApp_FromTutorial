import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getWeatherData from "./services/weatherService";

const App = () => {
  const getWeather = async () => {
    const data = await getWeatherData("weather", { q: "berlin" });
    console.log(data);
  };
  getWeather();

  return (
    <div
      className="mx-auto max-w-screen-lg mt-4 py-5 px-32
      bg-gradient-to-br shadow-xl shadow-gray-400 from-cyan-600 to-blue-700"
    >
      <TopButtons />
      <Inputs />
      <TimeAndLocation />
      <TempAndDetails />
      <Forecast />
      <Forecast />
    </div>
  );
};

export default App;
