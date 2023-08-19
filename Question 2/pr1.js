const exp=require('express');
const app=exp();
const axios=require('axios');
const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is at port ${PORT}`);
});
app.get('/numbers',async(req,res)=>{
    const urls=req.query.url;
    const valUrls=Array.isArray(urls)?urls:[urls];
    try{
        const pr=valUrls.map(url=>
            axios.get(url,{timeout:500}).catch(error=>{
                console.error(`Error fetching data from ${url}:`,error.message);
                return [];
            })
        );
        const resp=await Promise.allSettled(pr);
        const numbers=[];
        resp.forEach(r=>{
            if(r.status==='fulfilled' && r.value.data.numbers){
                numbers.push(...r.value.data.numbers);
            }
        });
        const diff=[...new Set(numbers)];
        const sort=diff.sort((a,b)=>a-b);
        res.json({numbers:sort});
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:'Server error'});
    }
});