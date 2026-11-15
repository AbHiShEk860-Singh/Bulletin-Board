const express= require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const db=require('../database/db.js');
app.get("/api/notices",async(req,res)=>{
    let arr;
    if(req.query.category==="")
    {
        arr=await db.getdata();
    }
    else
    {
        arr=await db.getdata(req.query.category);
    }
    console.log(req.query);
    res.json(arr);
});
function validate(req,res,next){
    const body = req.body;
    if(!body.title || !body.content)
    {
        res.status(400).json("Title or Content is missing");
        return;
    }
    next();
}
app.post("/api/notices", validate, (req, res) => {
    
    const body = req.body;

    const result = db.adddata(body);

    res.status(201).json(result);
});
app.delete("/api/notices/:id",async(req,res)=>{
    const value= await db.deletedata(req.params.id);
    if(value==0)
    {
        res.status(404).json("Id not found");
    }
    else
    {
        res.status(204).send();
    }
})
app.listen(5000,()=>{
    console.log("listening for requests");
});