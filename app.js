const express = require ("express");
const Sequelize = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/countries_db");
const { STRING, TEXT } = Sequelize;
const morgan = require ("morgan");
const app  = express();
app.use(morgan("dev"));
app.use(express.static("public")); //dump all pics of your cities here


const User = db.define("User", {
  city: {
    type: STRING,
    allowNull: false
  },
  population: {
    type: STRING,
    allowNull: false
  },
  language: {
    type: STRING,
    allowNull: false
  },
  content: {
    type: TEXT,
    allowNull: false
  }
})


const syncAndSeed = async () => {
  await db.sync({force: true});
  await User.create({
    city: "MexicoCity",
    population: "8.85",
    language: "Spanish",
    content: "A stroll through the buzzing downtown area reveals the capital’s storied history, from pre-Hispanic and colonial-era splendor to its contemporary edge. This high-octane megalopolis contains plenty of escape valves in the way of old-school cantinas, intriguing museums, inspired dining and boating excursions along ancient canals. With so much going on, you might consider scrapping those beach plans. Source: Lonely Planet."
  });

  await User.create({
    city: "Madrid",
    population: "3.22",
    language: "Spanish",
    content: "A stroll through the buzzing downtown area reveals the capital’s storied history, from pre-Hispanic and colonial-era splendor to its contemporary edge. This high-octane megalopolis contains plenty of escape valves in the way of old-school cantinas, intriguing museums, inspired dining and boating excursions along ancient canals. With so much going on, you might consider scrapping those beach plans. Source: Lonely Planet."
  });

  await User.create({
    city: "Paris",
    population: "2.16",
    language: "French",
    content: "A stroll through the buzzing downtown area reveals the capital’s storied history, from pre-Hispanic and colonial-era splendor to its contemporary edge. This high-octane megalopolis contains plenty of escape valves in the way of old-school cantinas, intriguing museums, inspired dining and boating excursions along ancient canals. With so much going on, you might consider scrapping those beach plans. Source: Lonely Planet."
  });
};


app.get("/", async (req, res, next) => {
  try{

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <h1> Top Cities to Travel to - Post Pandemic </h1>
    <link rel="stylesheet" type="text/css" href="/style.css"/>
  </head>
  <body>
    <div id = navbar>
      <a id = "Home" href = "/">Home</a>
   </div>

<center>
  <div class = three_boxes>
      <a id = "Mexico" href = "/cities/MexicoCity">Mexico City</a>
      <a id = "Spain" href = "/cities/Madrid">Madrid</a>
      <a id = "France" href = "/cities/Paris">Paris</a>
  </div>
</center>

  <div class = three_images>
      <img src = "/mexico_city.jpg" width = "300" height = "250"/>

     <img src = "/madrid.jpg" width = "300" height = "250"/>

      <img src = "/paris.jpg" width = "300" height = "250"/>
  </div>

  </body>
</html>`

 res.send(html);
  }catch(ex) {
    next(ex);
  }
})

app.get("/cities/:city", async(req,res) => {
  const city = req.params.city; //now that you have this, pass this in
  const userData = await User.findAll(); //have to use await whenever you talk to the database
  // console.log(userData);

  function sort(array){
  for (let i = 0; i < array.length; i ++){
    let currentObj = array[i]; // the user object
    for (let keys in currentObj){
      let currentKey = keys;
      let currentVal = currentObj[currentKey];
      if (typeof currentVal === "object"){
        //loop through currentVal
        for (let keys in currentVal){
          let newKey = keys;
          let newVal = currentVal[newKey];
          if (newVal === city){
            return currentVal;
          }
        }
      }
    }

  }
}//end of function call

const output = sort(userData);

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <h1> ${city} </h1>
    <link rel="stylesheet" type="text/css" href="/style.css"/>  </head>
  <body>
      <div id = navbar>
         <a id = "Home" href = "/">Home</a>
         <a id = "Mexico" href = "/cities/MexicoCity">Mexico City</a>
         <a id = "Spain" href = "/cities/Madrid">Madrid</a>
         <a id = "France" href = "/cities/Paris">Paris</a>
      </div>

      <p>
         Population: ${output.population} M | Languages Spoken: ${output.language}
      </p>
      <body>
        ${output.content}
      </body>
  </body>
</html>
`;
// res.send("remember to go back and fix the html code");
res.send(html);
})

const init = async () => {
  try{
    await db.authenticate();
    await syncAndSeed();
    const PORT =  process.env.PORT || 1337;
    app.listen(PORT, () => {
    console.log("listening in PORT");
})
  } catch(ex){
    console.log(ex);
  }
};

init();





