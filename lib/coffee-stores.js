import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 10,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map(result => result.urls.small);
}

export const fetchCoffeeStores = async () => {

  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${process.env.FOURSQUARE_CLIENT_ID}`,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(
      "43.771729042776116,-79.47968964334731",
      "Coffee",
      10
    ),
    options
  );
  const data = await response.json();
  // console.log("data: ",data.results.map(x => x.location))
  return data.results.map((value, idx) => {
    return {
      id: value.fsq_id,
      name: value.name,
      address: value.location.address + ', ' + value.location.locality || "",
      neighbourhood: value.location.neighborhood || value.location.cross_street || "",
      imgUrl : photos[idx],
    }
  });
};
