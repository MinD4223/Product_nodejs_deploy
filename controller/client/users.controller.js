const User = require("../../models/user.model");
const userSocket = require("../../socket/client/user.socket");
module.exports.notFriend = async (req, res) => {
  userSocket(res);
  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriend;
  const acceptFriends = myUser.acceptFriend;
  const users = await User.find({
    $and: [{ _id: { $nin: requestFriends } }, 
        { _id: { $ne: userId } },
        {_id: { $nin: acceptFriends }}
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("client/page/users/not-friend", {
    titlePage: "Danh sách người dùng",
    users: users,
  });
};

module.exports.request = async(req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    })

    const requestFriends = myUser.requestFriend;
    const users = await User.find({
        _id:{$in: requestFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/page/users/request",{
        titlePage: "Danh sach yeu cau",
        users: users
    })
}

module.exports.accept = async(req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    })

    const acceptFriends = myUser.acceptFriend;
    const users = await User.find({
        _id:{$in: acceptFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/page/users/accept",{
        titlePage: "Lời mời đã nhận",
        users: users
    })
}

module.exports.friend = async(req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    })

    const listFriends = myUser.friendList;

    const friendListId = listFriends.map(item => item.user_id)
    const users = await User.find({
        _id:{$in: friendListId},
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline");

    users.forEach(user => {
        const infoUser = listFriends.find(item => item.user_id == user.id)
        user.roomChatId = infoUser.room_chat_id
    })

    res.render("client/page/users/friend",{
        titlePage: "Danh sacsh banj be",
        users: users
    })
}

