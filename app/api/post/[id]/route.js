import connectMongo from "../../../../utils/connectMongo";
import PostModel from "../../../../models/postModel";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";

export async function GET(req,{params}) {
  try {
    await connectMongo();
    const {id} = await params;
    const postData = await PostModel.findOne({_id:id}).populate('user', 'username email');
    return NextResponse.json(postData);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, {params}) {
  try {
    await connectMongo();
    const {id} = await params;
    const data = await req.formData();
    const title = data.get("title");
    const content = data.get("content");
    const image = data.get("image");
    const userId = data.get("userId"); // User ID from client to verify ownership

    // Find the post first
    const post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Verify the user is the author
    if (post.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only edit your own posts" },
        { status: 403 }
      );
    }

    // Update fields
    const updateData = {
      title,
      description: content,
    };

    // Handle image update if a new image is provided
    if (image && image.size > 0) {
      // Delete old image if it exists
      if (post.image) {
        try {
          const oldImagePath = path.join(process.cwd(), "public", post.image);
          await unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
          // Continue even if old image deletion fails
        }
      }

      // Save new image
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = Date.now() + "-" + image.name;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      await writeFile(filePath, buffer);
      updateData.image = `/uploads/${fileName}`;
    }

    // Update the post
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('user', 'username email');

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, {params}) {
  try {
    await connectMongo();
    const {id} = await params;
    
    // Get userId from query params or headers
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // Find the post first
    const post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Verify the user is the author
    if (post.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the image file if it exists
    if (post.image) {
      try {
        const imagePath = path.join(process.cwd(), "public", post.image);
        await unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image file:", err);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post
    await PostModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
