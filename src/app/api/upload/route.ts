import { s3Client } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import crypto from 'crypto'

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { contentType, fileName } = await req.json()

        // Generate a unique file name
        const fileId = crypto.randomUUID();
        const uniqueFileName = `${userId}/${fileId}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFileName,
            ContentType: contentType,
        })

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 })

        return NextResponse.json({ url: signedUrl, key: uniqueFileName })
    } catch (error) {
        console.error("S3 Presigning Error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
