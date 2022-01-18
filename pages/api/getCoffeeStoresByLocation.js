import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {

    try {

        const { latLong, limit} = req.query;
        const response = await fetchCoffeeStores(latLong, limit)

        res.status(200).json(response)
    }
    catch(error) {
        console.error("There is error:",error);
        res.status(500).json({message: 'Oh no! Something went wrong'})
    }
} 

export default getCoffeeStoresByLocation;