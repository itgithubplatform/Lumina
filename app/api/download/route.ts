import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
    }

    // Fetch the file from GCS
    const response = await axios.get(url, {
      responseType: "arraybuffer", // important for binary files
    });

    // Forward content type to the client
    // @ts-ignore
    return new NextResponse(response.data, {
      headers: {
        "Content-Type": response.headers["content-type"] || "application/octet-stream",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}
