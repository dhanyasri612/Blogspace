import { NextResponse } from "next/server";
import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.formData();
    const title = data.get("title");
    const content = data.get("content");
    const image = data.get("image");
    const author = data.get("author");

    if (!title || !content || !author || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream({ folder: "blogspace" }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      }).end(buffer);
    });

    const newPost = await PostModel.create({
      title,
      description: content,
      image: uploadResult.secure_url,
      user: author,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
