const functions = require('firebase-functions');

const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const fuzz = require('fuzzy-matching');


admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body
main.use('/api/v1/locations', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

//initialize the database and the collection
const db = admin.firestore();
const locationCollection = 'location';

exports.webApi = functions.https.onRequest(main);

app.post('/', async (req, res) => {
  try {
    const location = {
      userId: req.body['userId'],
      name: req.body['name'],
      timestamp: Date.now()
    }
    const newLocation = await db.collection(locationCollection).add(location);
    res.status(201).send(newLocation.id);
  } catch (err) {
    res.status(400).send(`Failed to add the location info!!! ERROR: ${err}`);
  }
});

// app.get('/', async (req, res) => {
//   try {
//     const response = await db.collection(locationCollection).get();
//     const locations = [];
//     response.forEach(
//       (doc) => {
//         locations.push({
//           visitId: doc.id,
//           userId: doc.data().userId,
//           name: doc.data().name
//         });
//       }
//     );
//     res.status(200).json(locations);
//   } catch (err) {
//     res.status(500).send(`Get locations failed!!! ERROR: ${err}`);
//   }
// });

app.get('/visit', async (req, res) => {
  const visitId = req.query.visitId;
  const userId = req.query.userId;
  const searchString = req.query.searchString;
  let response;
  let details = [];
  let map = {};
  let fuzzTrainingArr = [];
  try {
    if (visitId) {
      response = await db.collection(locationCollection).doc(visitId).get();
      if (response) {
        details.push({
          userId: response.data().userId,
          name: response.data().name,
          visitId: response.id
        });
      }
    }
    else if (userId && searchString) {
      response = await db.collection(locationCollection)
        .where('userId', '==', userId)
        .orderBy('timestamp')
        .limit(5)
        .get();
      if (response) {
        response.forEach(
          doc => {
            map[doc.data().name] = {
              userId: doc.data().userId,
              name: doc.data().name,
              visitId: doc.id
            };
            fuzzTrainingArr.push(doc.data().name);
          }
        );
        let fm = new fuzz(fuzzTrainingArr);
        let matched = fm.get(searchString).value;
        let result = map[matched];
        details.push(result);
      }
    }

    res.status(200).json(details);
  } catch (err) {
    res.status(500).send(err);
  }
});

