import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.js";


const port = config.PORT;

connectDB();

app.listen(port, ()=>{
    console.log("Server is running on port "+ port);
})