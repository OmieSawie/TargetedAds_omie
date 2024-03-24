import React, { useEffect, useState } from "react";
import AdvertisementCard from "./AdvertisementCard"; // Import the AdvertisementCard component
import fetchAdvertisements from "../../../services/getAdvertisements"; // Import the fetchAdvertisements function

const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const getAdvertisements = async () => {
      const data = await fetchAdvertisements();
      setAdvertisements(data);
    };

    getAdvertisements();
    console.log(advertisements);
  }, []);

  return (
    <div>
      <h1>Advertisement List</h1>
      {advertisements &&
        advertisements.map((advertisement) => (
          <AdvertisementCard
            key={advertisement._id}
            advertisement={advertisement}
          />
        ))}
    </div>
  );
};

export default AdvertisementList;
