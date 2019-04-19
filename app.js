const express = require('express');
const exphdb = require('express-handlebars');
const path = require('path');
const sequelize = require('./config/database');

sequelize.authenticate()
    .then(() => console.log('connected'))
    .catch(err => console.log("Error: " + err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.engine("handlebars", exphdb({ defaultLayout: "main"}));
app.set('view engine', "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => res.render('index', {layout: 'landing'}));
app.use('/gigs', require('./routes/gigs'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server started on port ${PORT}`));