import { getUploadAuthParams } from "@imagekit/next/server";
import config from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { privateKey, publicKey } = config.env.imagekit;

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      {
        error: "ImageKit authentication failed.",
        statusCode: 500,
      },
      { status: 500 },
    );
  }
}
