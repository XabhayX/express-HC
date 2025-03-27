// npm init
// npm nodemon        --devDependency   === ignored in production


// import { configDotenv } from 'dotenv';
import express from 'express'
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = 3000; 



const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );




// req.body    contains data from frontend, as JSON string...(HTTP req body)....   which will be undefined here... so  has to be converted in JS objects...  Express cant reach JSON string directly.         For this, 
app.use(express.json()); 



app.get("/", (req, res)=>{
    res.send("Hello from Hitesh")
}) 


//////////////////////    add a new Tea  in Tea Section               --> Seller
let teaData = []; let  nextID = 1;
app.post("/teas", (req, res)=>{
    const {name, price} = req.body; 
    const newTea = {id:nextID++, name: name, price: price}
    teaData.push(newTea);
    res.status(201).send(newTea)
})
app.get("/teas", (req, res)=>{
    res.status(201).send("Hello")
})



///////////////////////   Buy a tea                                   --> Buyer

// app.get('/teas/:idNumber/:name', (req, res)=>{      // inthis case, teas/1  wont work,   u need to give full of it,  1/abhay
app.get('/teas/:idNumber/', (req, res)=>{             //   whatever is after /: is param  and  value of that param is given via frontend url
    // console.log(req.params)                          //  gives object of the parameters
    const tea = teaData.find(t => t.id === parseInt(req.params.idNumber))
    if(!tea) {res.status(404).send("Tea Not Found");}
    res.status(200).send(tea);
})






////////////////////////         update  Tea                  ---> Seller to backend
app.put('/teas/:id', (req, res)=>{
    const tea = teaData.find(t => t.id === parseInt(req.params.id));
    if(!tea) return res.status(404).send("Tea Not Found");
    
    const {name, price} = req.body; 
    tea.name = name; 
    tea.price = price;
    res.status(200).send(tea)
    
})




///////////////////////////              delete tea
app.delete('/teas/:id' , (req, res)=>{
    const teaIndex = teaData.findIndex(t => t.id === parseInt(req.params.id))
    if(teaIndex === -1){
        return res.status(404).send('Tea not found')
    }
    teaData.splice(teaIndex, 1); 
    return res.status(200).send("Deleted")
})


app.get("/hello", (req, res)=>{
    res.send("Hello")
})


app.listen(port, ()=>{
    console.log('App(server by express) is listening at port ', port)
})