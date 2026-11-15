import { useState,useEffect } from "react";
import { Card } from "./card";
import { Add } from "./Add";
export function App(){
    const [state,setstate]=useState([]);
    const [category,setcategory]=useState("");
    const [add,showadd]=useState(false);
    const [totalcategory,settotalcategory]=useState([]);
    const handleclick=()=>{
        showadd(true);
    }
    useEffect(() => {
        async function res() {
            const response = await fetch(
                `http://localhost:5000/api/notices?category=${category}`
            );

            const data = await response.json();

            setstate(data);

            settotalcategory(prev => {
                const categories = data.map(
                    element => element.category
                );

                return [...new Set([...prev, ...categories])];
            });
        }

        res();
    }, [category]);
    return (
        <div className="body">
        <div className="titletop">BULLETIN BOARD</div>
        <span id="upperlayerspan">
            <select value={category} onChange={(e) => setcategory(e.target.value)} >
                <option value="">All categories</option>
                {totalcategory.map((cat) => 
                    ( <option key={cat} value={cat}> {cat} </option> ))} 
                    </select>
            <button id="addnew" onClick={handleclick}>Add new notice</button>
        </span>
        {add && <Add setstate={setstate} showadd={showadd} settotalcategory={settotalcategory}/>}
        {!add &&<div className="whole">
        {
            state.map(element=>{
                return (
                <Card key={element.id} id={element.id}   setstate={setstate} title={element.title} content={element.content} category={element.category}/>
                );
            })
        }
        </div>
        }
        </div>
    )
}