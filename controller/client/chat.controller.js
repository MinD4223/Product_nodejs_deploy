const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const uploadToCloudinary = require("../../helpers/uploadToCloudirary")
const chatSocket = require("../../socket/client/chat.socket")
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;
    console.log(roomChatId)

    chatSocket(req, res)
   
    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted:false
    })
    for(const chat of chats){
        const infoUser = await User.findOne({
            _id:chat.user_id
        }).select("fullName")

        chat.infoUser = infoUser
    }
    
    res.render("client/page/chat/index", {
        pageTitle: "Chat",
        chats: chats
    })
}