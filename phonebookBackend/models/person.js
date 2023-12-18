const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.log("and error occured connecting to mongoDB", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedOject) => {
    returnedOject.id = returnedOject._id.toString();
    delete returnedOject._id;
    delete returnedOject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
