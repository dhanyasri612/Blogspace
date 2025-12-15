import { Schema , models , model } from "mongoose";

const postSchema = new Schema({
    title:String,
    description:String,
    image:String,
    created_at:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{toJSON:{
    virtuals:true,
}});
postSchema.virtual('short_description').get(function() {
  return this.description ? this.description.substring(0, 200) + "..." : "";
});

postSchema.virtual('created_at_formatted').get(function(){
    return changeDateFormat(this.created_at)
});

function changeDateFormat(dateString) {
    const date = new Date(dateString);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
const postModel = models.Post || model('Post', postSchema);

export default postModel;