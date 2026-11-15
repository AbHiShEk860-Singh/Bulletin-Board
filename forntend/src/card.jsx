import { useState } from "react"

export function Card({id,title,setstate,content,category}){
    const [Delete,setDelete]=useState(false);
    const handledelete=(id)=>{
        async function deletedata(id) {
            const response = await fetch(`http://localhost:5000/api/notices/${id}`,{method:"DELETE"});
            if (response.status === 204) {
                setDelete(true);
                alert("Notice deleted successfully");
               setstate(prev => prev.filter(item => item.id !== id));
            } else if (response.status === 404) {
                const data = await response.json();
                alert(data.message);
            }
        }
        deletedata(id);
    }
    return(
        <>
        {!Delete &&
            <div className="outer">
            <div className="upper">{category}</div>
            <div className="down">
                <div className="title">{title}</div>
                <div className="content">{content}</div>
            </div>
            <br />
            <br />
            <button id="delete" onClick={()=>handledelete(id)}>Delete</button>
            </div>
        }
            </>
    )
}