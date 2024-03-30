import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import { prisma } from "./utils/db"
import { now } from "./utils/utils"

dotenv.config()

const app = express()
const port = 3000

//app.use(express.json())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({
        "message": "API is running"
    })
})



app.listen(port, () => {
    console.log(`table service loaded`)
})