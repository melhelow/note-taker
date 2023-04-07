const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// app.get("/assets/css/styles.css", (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/assets/css/styles.css'))
// })
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
// const readAndAppend = (content, file) => {
//     fs.readFile(file, 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         const parsedData = JSON.parse(data);
//         parsedData.push(content);
//         writeToFile(file, parsedData);
//       }
//     });
//   };
 // GET Route for retrieving all the tips
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

  // POST Route for a new UX/UI tip
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
    //   readAndAppend(newNote, './db/db.json');



    } else {
      res.error('Error in adding note');
    }
  });
  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);