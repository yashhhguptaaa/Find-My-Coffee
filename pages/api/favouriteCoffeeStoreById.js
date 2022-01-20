import {
    getMinifiedRecords,
    table,
    findRecordByFilter,
  } from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {

            const record = records[0];

            const calculateVoting = parseInt(record.voting) + parseInt(1);

            // Update a record

            const updateRecord = await table.update([
                {
                    "id": record.recordId,
                    "fields" :{
                        "voting" : calculateVoting
                    }
                }
            ])

            if(updateRecord) {
                const minifiedRecords = getMinifiedRecords(updateRecord)
                res.json(minifiedRecords);
            }


          
        } else {
            res.status(400).json({message: "Coffee Store could not found"})
        }
      }
      else {
          res.status(400).json({message:"Id id missing"})
      }
    } catch (err) {
      console.error("Something went wrong", err);
      res.status(500).json({ message: "Error upvoting our coffee store", err });
    }
  }
};

export default favouriteCoffeeStoreById;
