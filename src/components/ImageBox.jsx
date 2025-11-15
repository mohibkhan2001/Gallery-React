import axios from "axios";
import React, { useEffect, useState } from "react";

const ImageBox = () => {
  const [currPage, setcurrPage] = useState("");
  const [userData, setUserData] = useState([]);

  const getData = async () => {
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=2&limit=10`
    );
    setUserData(response.data);
  };

  useEffect(
    function () {
      getData();
    },
    [currPage]
  );
  getData();
  return (
    <div className="w-full h-full border p-10">
      <div className="border w-1/6 h-2/4 rounded-md p-4">{userData.author}</div>
    </div>
  );
};

export default ImageBox;
