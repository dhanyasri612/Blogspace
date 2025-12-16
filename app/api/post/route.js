import { NextResponse } from "next/server";
import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.formData();
    const title = data.get("title");
    const content = data.get("content");
    const image = data.get("image");
    const author = data.get("author");

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Title, content, and author are required" },
        { status: 400 }
      );
    }

    let imagePath = "";

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + image.name;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const newPost = await PostModel.create({
      title,
      description: content,
      image: imagePath,
      user: author,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
