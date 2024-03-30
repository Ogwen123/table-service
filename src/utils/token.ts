import type { VerifyResponse } from "../global/types";

export const verifyToken = async (token: string): Promise<VerifyResponse | false> => {
    let url;

    if (process.env.ENVIRONMENT === "DEV") {
        url = "http://localhost:3000/api/"
    } else {
        url = "http://auth.owen-services.eu.org/api/"
    }

    const res = await fetch(url + "verify-token", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    if (!res.ok) {
        return false
    } else {
        return (await res.json()) as VerifyResponse
    }

}