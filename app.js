const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require("mongoose");
const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/isAuth");
const { addPath } = require("graphql/jsutils/Path");
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,

    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://vishwavijay:${process.env.MONGO_PASSWORD}@cluster0.lqwda.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected");
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });

// mutation{
//   createEvent(eventInput:{title:"a tale",description:"first try",price:55.5,date:"2020-12-25T12:59:59.347Z"}){
//     title
//   }
// }

// }
// mSzXOLT4TrXYfxCe;
// vishwavijay;
