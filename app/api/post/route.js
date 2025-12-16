import { NextResponse } from "next/server";
import connectMongo from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";
import cloudinary from "cloudinary";
import formidable from "formidable";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // important: disable default parser
  },
};

export async function POST(req) {
  try {
    await connectMongo();

    // Parse form data
    const form = new formidable.IncomingForm();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { title, content, author } = data.fields;
    const imageFile = data.files.image;

    if (!title || !content || !author || !imageFile) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(imageFile.filepath, { folder: "blogspace" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
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
