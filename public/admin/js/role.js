
//permission
const tablePermission = document.querySelector("[table-permission]")
if(tablePermission){
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click", () =>{
        let permission = [];
        const rows = tablePermission.querySelectorAll("[data-name]")
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name == "id"){
                inputs.forEach(input => {
                    const id = input.value
                    permission.push({
                        id: id,
                        permission: []
                    })
                })
            }else{
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if(checked){
                        permission[index].permission.push(name)
                    }
                   
                })
            }
        })
        console.log(permission)
        if (permission.length > 0) {
            const formChangePermission = document.querySelector("#form-change-permission")
            const inputPermission = formChangePermission.querySelector(`input[name='permission']`)
            inputPermission.value = JSON.stringify(permission)
            formChangePermission.submit()
        }
    })
}

//Permission default
const dataRecord= document.querySelector("[data-records]");
if (dataRecord) {
    const records = JSON.parse(dataRecord.getAttribute('data-records'));
    const tablePermission = document.querySelector("[table-permission]")
    records.forEach((record, index) => {
        const permissions = record.permissions;
        permissions.forEach(permission => {
            const row = tablePermission.querySelector(`[data-name='${permission}']`);
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        })
    })
}

