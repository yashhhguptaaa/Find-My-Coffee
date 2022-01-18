const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    // find a record
    try {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="0"`,
        })
        .firstPage();

      console.log({ findCoffeeStoreRecords });

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      } else {
        // create a record

        const createRecords = await table.create([
          {
            fields: {
              id: "1",
              name: "My favourite Coffee Store",
              address: "My address",
              neighbourhood: "Some Neighbourhood",
              voting: 200,
              imgUrl: "http://localhost:3000",
            },
          },
        ]);

        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });

        res.json({ message: "Created a record", records });
      }
    } catch (error) {
      console.log("Error finding store", error);
      res.status(500).json({ message: "Error finding store", error });
    }
  }
};

export default createCoffeeStore;
