const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");
module.exports = async(res) => {
    _io.once("connection", (socket) => {
        // người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async(userId) =>{
            const myUserId = res.locals.user.id;
            // console.log(myUserId)
            // console.log(userId)
            // Tim xem đã có trong danh sách kết bạn chưa
            const existUserAinB = await User.findOne({
                _id: userId,
                acceptFriend: myUserId
            })
            if(!existUserAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {acceptFriend: myUserId}
                })
            }
            //Tìm xem đã có trong danh sách yêu cầu chưa
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriend: userId 
            })
            if(!existUserBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {requestFriend: userId}
                })
            }
            //Lấy độ dài acceptFriend
            const infoUser = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUser.acceptFriend.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS",{
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })
             // thong tin loi moi
             const infoWhoSend = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName")

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND",{
                userId: userId,
                infoUser: infoWhoSend
            })

            
        })
        // Người dùng hủy gửi yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async(userId) =>{
            const myUserId = res.locals.user.id;
            // Tim xem đã có trong danh sách kết bạn chưa
            const existUserAinB = await User.findOne({
                _id: userId,
                acceptFriend: myUserId
            })
            console.log(existUserAinB)
            if(existUserAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {acceptFriend: myUserId}
                })
            }
            //Tìm xem đã có trong danh sách yêu cầu chưa
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriend: userId 
            })
            if(existUserBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {requestFriend: userId}
                })
            }
            // Thong so loi moi
            const infoUser = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUser.acceptFriend.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS",{
                userid: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{
                userId: userId,
                userIdA: myUserId
            })
           
        })

        socket.on("CLIENT_REFUSE_FRIEND", async(userId) =>{
            const myUserId = res.locals.user.id;
            // Tim xem đã có trong danh sách kết bạn chưa
            const existUserAinB = await User.findOne({
                _id: myUserId,
                acceptFriend: userId
            })
            if(existUserAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {acceptFriend: userId}
                })
            }
            //Tìm xem đã có trong danh sách yêu cầu chưa
            const existUserBinA = await User.findOne({
                _id: userId,
                requestFriend: myUserId
            })
            if(existUserBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {requestFriend: myUserId}
                })
            }
        })

        socket.on("CLIENT_ACCEPT_FRIEND", async(userId) =>{
            const myUserId = res.locals.user.id;
            // Tim xem đã có trong danh sách kết bạn chưa
            const existUserAinB = await User.findOne({
                _id: myUserId,
                acceptFriend: userId
            })
            const existUserBinA = await User.findOne({
                _id: userId,
                requestFriend: myUserId
            })

            let roomChat;
            if (existUserAinB && existUserBinA) {
                roomChat = new RoomChat(
                   { 
                    typeRoom: "friend",
                    users:[
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ]}
                )
                await roomChat.save();
            }

            if(existUserAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push:{
                        friendList:{
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {acceptFriend: userId}
                })
            }
            //Tìm xem đã có trong danh sách yêu cầu chưa
            
            if(existUserBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $push:{
                        friendList:{
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {requestFriend: myUserId}
                })
            }
        })
    })
}