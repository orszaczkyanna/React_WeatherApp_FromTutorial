import React from "react";

const TimeAndLocation = () => {
  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-xl font-extralight">
          Tuesday, 14 May 2024 | Local time: 07:21 AM
        </p>
      </div>

      <div className="flex items-center justify-center my-3">
        <p className="text-3xl font-medium">Berlin, DE</p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
