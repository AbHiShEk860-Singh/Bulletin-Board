const arr = [
    {
        id: "1",
        title: "Tech Sync Meeting",
        content: "Weekly sync for the dev team at 6 PM in Room 404.",
        category: "Tech",
        date: "2026-06-06",
    },
    {
        id: "3",
        title: "Sports Sync Meeting",
        content: "Weekly sync for the dev team at 6 PM in Room 404.",
        category: "Sports",
        date: "2026-06-06",
    }
];
async function getdata(category){
    if(!category)
    {
        return (arr);
    }
    else
    {
        const newarray = [];
        arr.forEach(element=>{
            if(element.category===category)
                newarray.push(element);
        })
        return newarray;
    }
}
function adddata(data)
{
    const newId = arr.length === 0
        ? 1
        : Math.max(...arr.map(element => Number(element.id))) + 1;

    const newdata = {
        ...data,
        id: String(newId),
        date: new Date(),
    };

    arr.push(newdata);

    console.log("Updated array:", arr);

    return newdata;
}
async function deletedata(id)
{
    let c=0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            c = 1;
            arr.splice(i, 1);
            break;
        }
    }
    if(c==0)
    {
        return 0;
    }
    return 1;
}
console.log(arr);
module.exports={getdata,adddata,deletedata};