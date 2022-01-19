import { getMinifiedRecords, table } from "../../lib/airtable";

const getCoffeeStoreById = async(req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      console.log({ findCoffeeStoreRecords });

      if (findCoffeeStoreRecords.length !== 0) {
        const records = getMinifiedRecords(findCoffeeStoreRecords);
        res.json(records);
      } else {
          res.json({message: `Id could not be found`});
      }
    } else {
      res.status(400).json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong", error });
  }
};

export default getCoffeeStoreById;
