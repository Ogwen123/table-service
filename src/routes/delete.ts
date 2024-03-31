import Joi from "joi";
import express from "express";

import { prisma } from "../utils/db";
import { now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { verifyToken } from "../utils/token";
import config from "../../config.json"

const SCHEMA = Joi.object({
    table_id: Joi.string().required()
})

export default async (req: express.Request, res: express.Response) => {
    // make sure the body of the request is valid

    const valid = validate(SCHEMA, req.body || {})

    if (valid.error) {
        error(res, 400, valid.data)
        return
    }

    const data = valid.data

    const token = req.get("Authorization")?.split(" ")[1]

    if (token === undefined) {
        error(res, 401, "Invalid token")
        return
    }

    const tokenRes = await verifyToken(token)

    if (tokenRes === false) {
        error(res, 401, "This is not a valid token.")
        return
    }

    const validToken = tokenRes.data

    await prisma.tables.delete({
        where: {
            id: data.table_id
        }
    })

    success(
        res,
        undefined,
        "Successfully deleted table."
    )
}
