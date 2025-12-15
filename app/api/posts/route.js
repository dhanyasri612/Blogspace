import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

// Ensure User model is registered (needed for populate)
// Using dynamic require for CommonJS module
let UserModel;
try {
  UserModel = require("../../../models/userModel");
} catch (e) {
  // If require fails, try import
  import("../../../models/userModel").catch(() => {});
}

export async function GET(req) {
  const query = req.nextUrl.searchParams.get('q');
 
  try {
    await connectMongo();
    
    const findQuery = query
      ? {
          $or: [
            { 'title': new RegExp(query, 'i') },
            { 'description': new RegExp(query, 'i') }
          ]
        }
      : {};
    
    const postData = await PostModel.find(findQuery)
      .populate({
        path: 'user',
        select: 'username email',
        strictPopulate: false
      })
      .sort({ created_at: -1 });
    
    // Convert to plain objects with virtuals
    const posts = postData.map(post => {
      const postObj = post.toObject({ virtuals: true });
      // Ensure virtuals are included
      if (!postObj.short_description && postObj.description) {
        postObj.short_description = postObj.description.substring(0, 200) + "...";
      }
      if (!postObj.created_at_formatted && postObj.created_at) {
        const date = new Date(postObj.created_at);
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        postObj.created_at_formatted = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      }
      return postObj;
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

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
