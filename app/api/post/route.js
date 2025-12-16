import { NextResponse } from "next/server";
import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";

export async function POST(req) {
  try {
    await connectMongo();

    // ✅ Read JSON body
    const { title, content, image, author } = await req.json();

    if (!title || !content || !author || !image) {
      return NextResponse.json(
        { error: "Title, content, image, and author are required" },
        { status: 400 }
      );
    }

    const newPost = await PostModel.create({
      title,
      description: content,
      image, // ✅ Image URL stored directly
      user: author,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
