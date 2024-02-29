import app from "./app.js";
import "dotenv/config";
import ConnectDB from "./db/index.js";

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server in running at PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connecion Error!!!", err);
  });