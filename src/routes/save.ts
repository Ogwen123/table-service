import Joi from "joi";
import express from "express";
import { v4 as uuidv4 } from "uuid"

import { prisma } from "../utils/db";
import { now, validate } from "../utils/utils";
import { error, success } from "../utils/api";
import { verifyToken } from "../utils/token";
import type { TokenData } from "../global/types";

const SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    rows: Joi.number().required(),
    columns: Joi.number().required(),
    content: Joi.any()
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

    const validToken: TokenData = tokenRes.data

    // get a unique id
    let id = ""
    let unique = false
    while (!unique) {
        id = uuidv4()
        unique = (await prisma.tables.findMany({
            where: {
                id
            }
        })).length === 0
    }

    //@ts-ignore
    const cells = Object.entries(data.content).map(([key, value]: [string, string]) => {
        return {
            id: uuidv4(),
            location: key,
            content: value
        }
    })

    await prisma.tables.create({
        data: {
            id: id,
            user_id: validToken.id,
            name: data.name,
            type: data.type,
            rows: data.rows,
            columns: data.columns,
            table_contents: { create: cells },
            created_at: now()
        }
    })

    success(
        res,
        undefined,
        "Successfully saved table."
    )
}  