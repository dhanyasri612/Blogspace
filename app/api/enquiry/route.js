import connectMongo from "@/utils/connectMongo";
import EnquiryModel from "@/models/enquiryModel";
export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    const enquiry = { name, email, message };
    await connectMongo();
    await EnquiryModel.create(enquiry);
    return new Response(JSON.stringify({ message: "Enquiry received" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error._message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
