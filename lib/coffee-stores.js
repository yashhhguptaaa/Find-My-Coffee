const getUrlForCoffeeStores = (latlong, query, limit) => {
    return `https://api.foursquare.com/v3/places/nearby?ll=${latlong}&query=${query}&limit=${limit}`
}


export const fetchCoffeeStores = async () => {
    const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `${process.env.FOURSQUARE_CLIENT_ID}`
        }
      };
      
      
    const response = await fetch(getUrlForCoffeeStores('43.771729042776116,-79.47968964334731','Coffee',30), options)
    const data = await response.json()


    return data.results;
}