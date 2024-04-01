import type { VerifyResponse } from "../global/types";

export const verifyToken = async (token: string): Promise<VerifyResponse | false> => {
    let url;

    if (process.env.ENVIRONMENT === "DEV") {
        url = "http://localhost:3000/api/"
    } else {
        url = "http://auth.owen-services.eu.org/api/"
    }
    console.log(token)
    const res = await fetch(url + "verify-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token })
    })

    if (!res.ok) {
        res.json().then((data) => console.log(data))
        return false
    } else {
        return (await res.json()) as VerifyResponse
    }

}