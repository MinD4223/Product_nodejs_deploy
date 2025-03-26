//Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[button-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("button-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[button-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("button-cancel-friend");
            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}

// Chức năng xóa kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[button-refuse-friend]");
if (listBtnRefuseFriend .length > 0) {
    listBtnRefuseFriend .forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse")
            const userId = button.getAttribute("button-refuse-friend");
            socket.emit("CLIENT_REFUSE_FRIEND", userId)
        })
    })
}

// chức năng chấp nhận
const listBtnAcceptFriend = document.querySelectorAll("[button-accept-friend]");
if (listBtnAcceptFriend .length > 0) {
    listBtnAcceptFriend .forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accept")
            const userId = button.getAttribute("button-accept-friend");
            socket.emit("CLIENT_ACCEPT_FRIEND", userId)
        })
    })
}
// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data)=>{
    const badgeUserAccept = document.querySelector("[badge-users-accept]");
    const userId = badgeUserAccept.getAttribute("badge-users-accept");
    if (userId == data.userId) {
        badgeUserAccept.innerHTML = data.lengthAcceptFriends
    }
})

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data)=>{
    const dataUserAccept = document.querySelector("[data-users-accept]");
    if (dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-users-accept");
        if (userId == data.userId) {
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.infoUser._id)
            newBoxUser.innerHTML=`
                <div class="box-user">
                        <div class="inner-avatar">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMqI4dJM6gAS7v_jKJy0_bCkeqZpZ-_vPO67WSQpi-9wqkdqScFvd57VvMG3qS2NnbzXU&usqp=CAU" alt="levan a">
                        </div>
                        <div class="inner-info">
                            <div class="inner-name">${data.infoUser.fullName}</div>
                            <div class="inner-buttons">
                                <button class="btn btn-sm btn-primary mr-1 " button-accept-friend="${data.infoUser._id}">Chấp nhận</button>
                                <button class="btn btn-sm btn-secondary mr-1 " button-refuse-friend="${data.infoUser._id}">Xóa</button>
                                <button class="btn btn-sm btn-secondary mr-1 " button-deleted-friend="button-deleted-friend" disabled="disabled">Đã xóa</button>
                                <button class="btn btn-sm btn-primary mr-1 " button-accepted-friend="button-accepted-friend" disabled="disabled">Đã chấp nhận</button>
                            </div>
                        </div>
                    </div>
            `
            dataUserAccept.appendChild(newBoxUser)
            const btnRefuseFriend = newBoxUser.querySelector("[button-refuse-friend]");
            btnRefuseFriend.addEventListener("click", () => {
                btnRefuseFriend.closest(".box-user").classList.add("refuse")
                const userId = btnRefuseFriend.getAttribute("button-refuse-friend");
                socket.emit("CLIENT_REFUSE_FRIEND", userId)
            })
    
            dataUserAccept.appendChild(newBoxUser)
            const btnAcceptFriend = newBoxUser.querySelector("[button-accept-friend]");
            btnAcceptFriend.addEventListener("click", () => {
                btnAcceptFriend.closest(".box-user").classList.add("accept")
                const userId = btnAcceptFriend.getAttribute("button-accept-friend");
                socket.emit("CLIENT_ACCEPT_FRIEND", userId)
            })
        }
    }
    // Danh sach nguoi dung
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute("data-users-not-friend")
        if (userId == data.userId) {
            const boxUserRemove = dataUserNotFriend.querySelector(`[user-id="${data.infoUser._id}"]`)
            if (boxUserRemove) {
                dataUserNotFriend.removeChild(boxUserRemove)
            }
        }
    }
})

socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUserAccept = document.querySelector("[data-users-accept]");
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId == data.userId) {
        const boxUserRemove = dataUserAccept.querySelector(`[user-id="${data.userIdA}"]`)
        if (boxUserRemove) {
            dataUserAccept.removeChild(boxUserRemove)
        }
       
    }
})

socket.on("SERVER_RETURN_USER_ONLINE", (userId) =>{
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector("[status]").setAttribute("status", "online");
            boxUser.querySelector("[status]").textContent = "online"
        }
    }
})

socket.on("SERVER_RETURN_USER_OFFLINE", (userId) =>{
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector("[status]").setAttribute("status", "offline");
            boxUser.querySelector("[status]").textContent = "offline"
        }
    }
})