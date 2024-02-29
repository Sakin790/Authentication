import express from "express"
import morgan from "morgan";
import bodyParser from "body-parser";




const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


export default app;