import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const Images = () => {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);

  const getData = async () => {
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=${page}&limit=10`
    );
    setUserData(response.data);
    console.log(page);
  };

  let printData = "Loading Data...";
  if (userData.length > 0) {
    printData = userData.map(function (elem, idx) {
      return (
        <div className="flex flex-col gap-8" loading="lazy">
          <div className="h-80 w-90 bg-white rounded-xl hover:scale-105 transition">
            <img
              className="h-full w-full object-cover "
              src={elem.download_url}
              key={idx}
            />
          </div>
          <h2 className="text-gray-white font-bold" key={idx}>
            {elem.author}
          </h2>
        </div>
      );
    });
  }

  const nextPage = () => {
    setPage(page + 1);
    console.log(page);
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
    console.log(page);
  };

  useEffect(() => {
    getData();
  }, [page]);
  return (
    <div className="bg-[#313131] text-white overflow-auto p-4 h-screen">
        <h1 className="text-4xl text-white text-center my-10 uppercase font-bold">My gallery</h1>
      <div className="flex flex-wrap gap-4">{printData}</div>

      <div className="flex justify-center gap-20 mt-10">
        <button
          className="px-8 py-4 bg-emerald-800 text-white rounded-xl"
          onClick={prevPage}
        >
          Prev
        </button>
        <button
          className="px-8 py-4 bg-emerald-800 text-white rounded-xl"
          onClick={nextPage}
        >
          {" "}
          Next
        </button>
      </div>
    </div>
  );
};

export default Images;
