const User = require("../../models/user.model")
const RoomChat = require("../../models/room-chat.model")
module.exports.index = async (req, res) =>{
    const userId = res.locals.user.id;
    const listRoomChat = await RoomChat.find({
        "users.user_id": userId,
        typeRoom: "group",
        deleted: false
    })
    console.log(userId)
    console.log(listRoomChat)
    res.render("client/page/room-chat/index",{
        pageTitle: "Phong chat",
        listRoomChat: listRoomChat
    })
}

module.exports.create = async (req, res) =>{
    const listFriend = res.locals.user.friendList
    for(const friend of listFriend){
        const infoUser = await User.findOne({
            _id: friend.user_id
        }).select("fullName"); 
        friend.infoFriend = infoUser
    }
    res.render("client/page/room-chat/create",{
        pageTitle: "Nhóm tạo",
        friendList: listFriend
    })
}

module.exports.createPost = async (req, res) =>{
    const title = req.body.title;
    const usersId = req.body.userId;
    const dataChat ={
        title: title,
        typeRoom: "group",
        users: [ ]
    }

    usersId.forEach(userId =>{
        dataChat.users.push({
            user_id: userId,
            role: "user"
        })
    })
    dataChat.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })
    const room = new RoomChat(dataChat);
    await room.save()
    res.redirect(`/chat/${room.id}`)
}