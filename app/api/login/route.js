import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await connectMongo();
    const user = await userModel.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    if (user.password !== password) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
      });
    }
    // Return user object without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
    return new Response(
      JSON.stringify({ message: "Login successful", user: userResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e._message }));
  }
}
