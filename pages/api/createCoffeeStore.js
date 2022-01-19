import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    // find a record
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          // create a record

          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  neighbourhood,
                  address,
                  imgUrl,
                  voting,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);

            res.json({ message: "Created a record", records });
          } else {
            res.status(400).json({ message: "Name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (error) {
      console.log("Error creating or finding a store", error);
      res
        .status(500)
        .json({ message: "Error creating or finding a store", error });
    }
  }
};

export default createCoffeeStore;
