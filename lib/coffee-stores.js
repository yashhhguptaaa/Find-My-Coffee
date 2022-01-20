import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map(result => result.urls.small);
}

export const fetchCoffeeStores = async (latlong = "43.771729042776116,-79.47968964334731", limit=6) => {

  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}`,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(
      latlong,
      "Coffee",
      limit
    ),
    options
  );
  const data = await response.json();
  
  return data.results.map((value, idx) => {
    return {
      id: value.fsq_id,
      name: value.name,
      address: value.location.address || value.location.locality || "",
      neighbourhood: value.location.neighborhood || value.location.cross_street || "",
      imgUrl : photos[idx],
    }
  });
};
