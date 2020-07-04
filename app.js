const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolver/index');
const isAuth = require('./middleware/is-auth');

const app = express();

// const events = [];

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AUthorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

// app.get('/', (req, res, next) => {
//     res.send('Hello World!');
// })

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${
        process.env.MONGO_USER
    }:${
        process.env.MONGO_PASSWORD
    }@neverland-rqtyf.mongodb.net/${
        process.env.MONGO_DB
    }?retryWrites=true&w=majority`
).then(() => {
    app.listen(8000);
}).catch(err => {
    console.log(err);
});
