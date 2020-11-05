const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const url = process.env.MONGODB_URI;

const client = new MongoClient(url, { useUnifiedTopology:true });
client.connect();

app.post('/api/addcard', async (req, res, next) =>
{
    // incoming: name
    // outgoing: error

    var error = '';

    const {userId, card} = req.body;

    const newCard = {Card:card, UserId:userId};

    try
    {
        const db = client.db();
        const result = db.collection('cards').insertOne(newCard);

    }
    catch(e)
    {
        error = e.toString();
    }

    // TEMP FOR LOCAL TESTING.
    //cardList.push(card);

    var ret = {error: error};
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => 
{
    // incoming: username, password
    // outgoing: userId, firstName, lastName, error

    var error = '';

    const { username, password } = req.body;

    const db = client.db();
    const results = await db.collection('Users').find({Username:username,Password:password}).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    if( results.length > 0 )
    {
    id = results[0].UserId;
    fn = results[0].FirstName;
    ln = results[0].LastName;
    }

    var ret = { userId:id, firstName:fn, lastName:ln, error:''};
    res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) => 
{
    // incoming: firstName, lastName, username, password, email, address1, address2, address3
    // outgoing: error, success

    var error = '';

    const { firstName, lastName, login, password, email } = req.body;
    const newUser = {firstName:firstName, lastName:lastName, login:login, password:password, email:email};
    
    try
    {
    const db = client.db();
    const result = db.collection('Users').insertOne(newUser); 
    var ret = { error:'',success:true};
    res.status(200).json(ret);		
    }
    catch(e)
    {
    res.status(500).json({success:false,error:e});  
    
    }
});

app.post('/api/searchcards', async (req, res, next) =>
{
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const {userId, search} = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db.collection('cards').find({"Card":{$regex:_search+'.*', $options:'ri'}, "UserId":userId}).toArray();
    
    var _ret = [];

    for (var i=0; i<results.length; i++)
    {
        _ret.push(results[i].Card);
    }

    var ret = {results:_ret, error:''};
    res.status(200).json(ret);
});

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
    // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

//app.listen(5000); //start Node + Express server on port 5000

app.listen(PORT, () => 
{
    console.log('Server listening on port ${PORT}.');
});