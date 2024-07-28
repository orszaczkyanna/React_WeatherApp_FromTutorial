import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Inputs = () => {
  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 intems-center justify-center space-x-4">
        <input
          type="text"
          placeholder="search by city..."
          className="text-gray-500 text-xl p-2 w-full shadow-xl
                capitalize placeholder:lowercase focus:outline-none "
        />
        <BiSearch
          size={30}
          className="cursor-pointer hover:scale-125 transition ease-out"
        />
        <BiCurrentLocation
          size={30}
          className="cursor-pointer hover:scale-125 transition ease-out"
        />
      </div>

      <div className="flex flex-row w-1/4 items-center justify-center">
        <button className="text-2xl font-medium transition ease-out hover:scale-125">
          °C
        </button>
        <p className="text-2xl font-medium mx-1.5">|</p>
        <button className="text-2xl font-medium transition ease-out hover:scale-125">
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
