import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

const IMAGE_W = 600; // default requested width
const IMAGE_H = 400; // default requested height

const App = () => {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState(new Set()); // track images still loading
  const [isFetching, setIsFetching] = useState(false);

  const getData = useCallback(async (p = page) => {
    try {
      setIsFetching(true);
      const response = await axios.get(
        `https://picsum.photos/v2/list?page=${p}&limit=10`
      );
      setUserData(response.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setIsFetching(false);
    }
  }, [page]);

  // Preload images for the next page (simple Image() method)
  const preloadNextPage = useCallback(async (nextPage) => {
    try {
      const { data } = await axios.get(
        `https://picsum.photos/v2/list?page=${nextPage}&limit=10`
      );
      data.forEach((img) => {
        const preload = new Image();
        // request a moderate-size image for preload
        preload.src = `https://picsum.photos/id/${img.id}/${IMAGE_W}/${IMAGE_H}`;
      });
    } catch (err) {
      // don't fail hard on preload
      // console.log("Preload failed", err)
    }
  }, []);

  useEffect(() => {
    getData(page);
    // preload next page in background
    preloadNextPage(page + 1);
  }, [page, getData, preloadNextPage]);

  // helpers to track per-image loading for skeleton
  const handleImgLoadStart = (id) => {
    setLoadingIds(prev => new Set(prev).add(id));
  };
  const handleImgLoaded = (id) => {
    setLoadingIds(prev => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
  };

  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));

  return (
    <div className="bg-[#313131] text-white overflow-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            className="bg-emerald-900 p-3 text-md m-2 rounded"
            onClick={() => getData(page)}
            disabled={isFetching}
          >
            Refresh
          </button>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-emerald-800 text-white rounded mr-4"
            onClick={prevPage}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 bg-emerald-800 text-white rounded"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userData.length === 0 && !isFetching && (
          <div className="text-gray-300">No images found.</div>
        )}
        {isFetching && userData.length === 0 && (
          <div className="text-gray-300">Loading data...</div>
        )}

        {userData.map((elem) => {
          // build a Picsum URL for requested sizes (better than huge download_url)
          const base = `https://picsum.photos/id/${elem.id}`;
          const small = `${base}/300/200`; // for small screens
          const medium = `${base}/${IMAGE_W}/${IMAGE_H}`;
          const large = `${base}/900/600`;

          const isLoading = loadingIds.has(elem.id);

          return (
            <div
              key={elem.id}
              className="flex flex-col gap-3 bg-[#1f1f1f] p-2 rounded-lg overflow-hidden"
              style={{ minHeight: 200 }}
            >
              {/* Skeleton / placeholder */}
              {isLoading && (
                <div className="animate-pulse bg-gray-700 rounded h-48 w-full" />
              )}

              <img
                // src uses a moderate size
                src={medium}
                // support responsive pick
                srcSet={`${small} 300w, ${medium} 600w, ${large} 900w`}
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px"
                alt={elem.author}
                // native lazy loading (supported in modern browsers)
                loading="lazy"
                decoding="async"
                width={IMAGE_W}
                height={IMAGE_H}
                className={`w-full object-cover rounded ${isLoading ? "hidden" : ""}`}
                onLoad={() => handleImgLoaded(elem.id)}
                onError={() => handleImgLoaded(elem.id)}
                onLoadStart={() => handleImgLoadStart(elem.id)}
              />

              <h2 className="text-gray-200 font-medium truncate">{elem.author}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
