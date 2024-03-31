import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import get from "./routes/get/index"
import save from "./routes/save"
import search from "./routes/get/search"
import _delete from "./routes/delete"

//@ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

dotenv.config()

const app = express()
const port = 3001

//app.use(express.json())
app.use(bodyParser.json())

app.use('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PATCH,DELETE,OPTIONS")
    res.header("Access-Control-Max-Age", "86400")
    next();
});

app.get('/', (req, res) => {
    res.send({
        "message": "API is running"
    })
})

app.post("/api/get", (req, res) => {
    get(req, res)
})

app.post("/api/get/search", (req, res) => {
    search(req, res)
})

app.post("/api/save", (req, res) => {
    save(req, res)
})

app.delete("/api/delete", (req, res) => {
    _delete(req, res)
})

app.listen(port, () => {
    console.log(`table service loaded, ${port}`)
})