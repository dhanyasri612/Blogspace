const { Schema, models, model } = require("mongoose");

const enquirySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});


const enquiryModel = models.Enquiry || model("Enquiry", enquirySchema);

module.exports = enquiryModel;