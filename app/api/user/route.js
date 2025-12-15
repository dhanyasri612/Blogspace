import connectMongo from "@/utils/connectMongo";
import userModel from "@/models/userModel.js";

export async function GET(request) {
  return new Response("User GET request received");
}

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;
    const user = { username, email, password }
    await connectMongo();
    await userModel.create(user);
    const responseMessage = {
      message: "User POST request received",
      userData: {
        username,
        email,
        password,
      },
    };
    return new Response(JSON.stringify(responseMessage), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({"error":e._message}));
  }
}
