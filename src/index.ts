import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import { prisma } from "./utils/db"
import get from "./routes/get/index"
import save from "./routes/save"
import search from "./routes/get/search"
import _delete from "./routes/delete"
import { error } from "./utils/api"

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

app.use("/api/*", async (req, res, next) => {
    let enabled
    const enabledRes = (await prisma.services.findUnique({
        where: {
            id: "abc3d324-9055-4cb5-8c3e-34a3da32b847"
        },
        select: {
            enabled: true
        }
    }))


    if (enabledRes === undefined || enabledRes === null) {
        enabled = true
    } else {
        enabled = enabledRes.enabled
    }

    //console.log(enabledRes)

    //console.log(enabled)
    if (enabled) {
        next();
    } else {
        error(res, 403, "This service is disabled.")
    }
});

app.get('/', async (req, res) => {
    const enabled = (await prisma.services.findUnique({
        where: {
            id: "abc3d324-9055-4cb5-8c3e-34a3da32b847"
        },
        select: {
            enabled: true
        }
    }))?.enabled

    res.send({
        "message": (enabled ? "API is running." : "API is disabled.")
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