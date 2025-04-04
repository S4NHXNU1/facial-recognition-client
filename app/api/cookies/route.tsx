import { createCookie, getCookie, deleteCookie } from "@/utils/cookie";
import { CookieRes } from "@/utils/models/cookieRes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");
    const value = req.nextUrl.searchParams.get("value");

    const res: CookieRes = {
        status: 400,
        value: "",
    }

    if(key && value) 
    {
        createCookie(key, value);
        res.status = 200;
        res.value = value;
    }
    else if(key && !value)
    {
        if(getCookie(key))
        {
            res.status = 200;
            res.value = getCookie(key)?.value;
        }
        else
        {
            res.status = 404;
            res.value = "Cookie not found";
        }
    }

    return NextResponse.json(res);
}

export async function DELETE(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");

    const res: CookieRes = {
        status: 400,
        value: "",
    }

    if(key)
    {
        if(getCookie(key))
        {
            res.status = 200;
            res.value = getCookie(key)?.value;
            deleteCookie(key);
        }
        else
        {
            res.status = 404;
            res.value = "Cookie not found";
        }
    }

    return NextResponse.json(res);
}