
export function Add({setstate,showadd,settotalcategory}){
            async function handlesubmit(e){
                e.preventDefault();
            const form = new FormData(e.target);
            const response = await fetch("http://localhost:5000/api/notices",{method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    title:form.get("title"),
                    category:form.get("category"),
                    content:form.get("content"),
                })
            });
            const data=await response.json();
            if(response.status!=400)
            {
                setstate(prev=>[...prev,data]);
                settotalcategory(prev => {
                    const newCategory = form.get("category");

                    if (!prev.includes(newCategory)) {
                        return [...prev, newCategory];
                    }

                    return prev;
                    
                });
                showadd(false);
            }
            else
            {
                alert(data);
            }
        }
    return(
        <div className="outform">
        <div className="out">
                <div id="top">Notice</div>
                <div className="addinput">
                    <form onSubmit={handlesubmit}>
                    <label htmlFor="title">Title: </label><input type="text" id="title" name="title"/>
                    <br />
                    <br />
                    <label htmlFor="category">Category: </label><input type="text" id="category" name="category"/>            
                    <br />
                    <br />
                    <label htmlFor="content"></label><div id="cont"><div id="content1">Content: </div><div id="textare"><textarea type="text" id="content" name="content"/></div></div>
                    <br />
                    <span id="formbutton">
                    <button id="submit">Submit</button><button id="close" onClick={()=>showadd(false)}>Close</button>
                    </span>
                    </form>
                    
                </div>
            </div>
        </div>
    )
}
