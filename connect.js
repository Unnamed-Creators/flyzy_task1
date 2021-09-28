const mongoose = require("mongoose");
const chalk = require("chalk");

function connectDB() {
    var url = process.env.MONGO_URL; // get from mongourl
    if (process.env.DB_MODE === "local" || url === "" || !url) {
        // if DB_MODE is local or empty or this no url, use the local mongodb server
        // url = "mongodb://127.0.0.1:27017/SalesGateKaviiTest";
        url = "mongodb+srv://Jitul:aFgXY9KTB0UowMnj@cluster0.umzd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        console.info(
            chalk.bgWhite.black(
                "Attempting to connect to Local Mongodb at PORT 27017"
            )
        );
    }
    mongoose.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) {
                console.log(chalk.bgRed("Error"));
                console.error(err);
            } else console.info(chalk.green("Database Connected!"));
        }
    );
}

module.exports = connectDB;
