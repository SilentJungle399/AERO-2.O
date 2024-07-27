const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const notificationsSchema = new mongoose.Schema({
    notifications_title:{
        type:String,
        default:""
    },
    //this would be array of paragraphs...
    notifications_text:[{
        type:String,
        default:""
    }],
    //array of urls of files from firebase
    notificaitons_files: [
        {
          url: {
            type: String,
            default: "",
          },
          file_type: {
            type: String,
            default: "",
          },
        },
      ],
    created_at:{
        type:Date,
        default:Date.now,
         expires: '1y'
    },
});

const NotificationModel = mongoose.model("notifications", notificationsSchema);

module.exports = NotificationModel;
