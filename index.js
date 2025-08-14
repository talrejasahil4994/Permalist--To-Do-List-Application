import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

const db=new pg.Client({
user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "", 
  port: 5433,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  const result=await db.query("select * from items order by id asc;");
  items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
try {await db.query("insert into items (title) values ($1)",[item]);
  res.redirect("/");}
  catch (error) {
  console.error(error.message); 
}
});

app.post("/edit", async(req, res) => {
const item=req.body.updatedItemId;
const title=req.body.updatedItemTitle;
try{
await db.query("update items set title=$1 where id=$2;",[title,item]);
res.redirect("/");
} catch(error){
  console.error(error.message);
}
});

app.post("/delete", async(req, res) => {
  const item=req.body.deleteItemId;
  // console.log(item);
  try{
await db.query("delete from items where id=$1",[item]);
res.redirect("/");
  } catch (error) {
  console.error(error.message); 
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
