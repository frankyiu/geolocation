import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const getTimeZone = async (location, timestamp) => {
  //   const url = `https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810%2C-119.6822510&timestamp=1331161200&key=${API_KEY}`;

  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=${timestamp}&key=${API_KEY}`;

  var config = {
    method: "get",
    url,
    headers: {},
  };

  const response = await axios(config);
  return response.data;
};

export default getTimeZone;
