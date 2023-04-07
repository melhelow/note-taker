const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');


const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };

      readFromFile('./db/db.json', "utf-8").then((data) => {
        console.log(data);
        const dataArr = JSON.parse(data);
        console.log(dataArr);

        dataArr.push(newNote);

        console.log(dataArr);

        fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), () => {
            res.json(`Note added successfully 🚀`);
        })

      });
  



    } else {
      res.error('Error in adding note');
    }
  });
  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);