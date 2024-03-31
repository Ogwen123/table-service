import Joi from "joi";
import express from "express";

import { prisma } from "../../utils/db";
import { now, validate } from "../../utils/utils";
import { error, success } from "../../utils/api";
import { verifyToken } from "../../utils/token";
import config from "../../../config.json"

const SCHEMA = Joi.object({
    page: Joi.number().required().min(0)
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

    const tables = await prisma.tables.findMany({
        where: {
            user_id: validToken.id
        },
        include: {
            table_contents: {
                select: {
                    location: true,
                    content: true
                }
            }
        },
        skip: config.pages.table_page_size * data.page,
        take: config.pages.table_page_size
    })

    success(
        res,
        tables,
        "Successfully fetched tables."
    )
}