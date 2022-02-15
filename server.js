'use strict';

const path = require('path');
var uuid = require('uuid');


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(require('cors')());
app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Request-Headers', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, OPTIONS, PUT',
    '*'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, X-Auth-Token, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const port = 8082;

const mongodb = require('mongodb');
const { status } = require('express/lib/response');
const { clearScreenDown } = require('readline');
const { disconnect, debugPort } = require('process');
const req = require('express/lib/request');
const uri = 'mongodb://127.0.0.1:27017';
const client = new mongodb.MongoClient(uri);
const databaseName = 'Advertisements';
const collectionName = 'Clients';
const admin = { userName: 'admin', password: 'admin' };

let screensNamesArr = [];

client.connect((err) => {
  if (err) {
    console.log('***Connection with mongodb failed ');
    console.log(err);
  } else console.log('***Connection with mongodb created');

  const db = client.db(databaseName);
  db.dropDatabase();

  db.collection('Admins')
    .insertOne(admin)
    .then(
      console.log(
        `Successfully inserted admin with User Name: ${admin.userName} and Password: ${admin.password}`
      )
    )
    .catch((err) => console.error(`Failed to insert admin: ${err}`));

  db.collection(collectionName).insertMany([{ id: 0 }], function () {
    if (db.listCollections({ name: collectionName }).hasNext()) {
      db.dropCollection(collectionName, function (err) {
        if (err) console.log(err);
      });

      db.createCollection(collectionName, function (err, res) {
        if (err) throw err;
      });
    }

    db.collection(collectionName).insertMany(
      newClients,

      (error) => {
        if (error) return console.log('***EROR\n', error);

        db.collection(collectionName)
          .find()
          .toArray(function (err, result) {
            result.forEach((doc) => {
              screensNamesArr.push(doc.id);
            });
          });
      }
    );
  });
});

/* ---------------express use--------------- */
server.listen(port);
console.log(`***Server started running at http://localhost: ${port}`);

/* ---------------'localhost:8080'--------------- */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/homePage.html'));
});

/* --------------'localhost:8080/screen-x'-------------- */
app.get('/:uid', function (request, response) {
  let id = request.params.uid;

  if (screensNamesArr.includes(id)) connectToSocket(response, id);
  else if (id === 'admin') getAdmin(response);
  else if (id === 'clients') getClients(response);
  else response.sendFile(path.join(__dirname, '/homePage.html'));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* --------------'Check admin authentication'-------------- */ // e.g http://localhost/8080/login
app.post('/login', function (request, response) {
  let dbo;
  let adminResource = request.body;
  let admins;
  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);

      admins = await dbo
        .collection('Admins')
        .find({ userName: 'admin' })
        .toArray();

      const admin = admins[0];
      if (admin.password == adminResource.password) {
        return response.status(200).json({
          isAuth: true,
        });
      } else
        return response.status(404).json({
          isAuth: false,
        });
    });
  } catch (exception) {
    console.log(`Error while checking admin authentication`, exception);
    return response.status(400).send();
  }
});

/* --------------'Change admin password'-------------- */ // e.g http://localhost/8080/password //todo fix not working
app.put('/password', function (request, response) {
  let dbo;
  let password = request.body.password;
  let admins;
  console.log('password: ', password);
  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);

      admins = await dbo
        .collection('Admins')
        .find({ userName: 'admin' })
        .toArray();

      admins[0].password = password;
      dbo
        .collection('Admins')
        .updateOne({ userName: 'admin' }, { $set: { password: password } });
    });

    return response.status(200).json({
      success: true,
    });
  } catch (exception) {
    console.log(
      `Error while trying to change password to the admin`,
      exception
    );
    return response.status(400).json({
      success: false,
    });
  }
});

/* --------------'Get clients'-------------- */ // e.g http://localhost/8080/clients
function getClients(response) {
  let dbo;

  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let clientsScreens = await dbo
        .collection(collectionName)
        .find()
        .toArray();
      return response.status(200).json(clientsScreens);
    });
  } catch (exception) {
    return null;
  }
}

/* --------------'Get client'-------------- */ // e.g http://localhost/8080/clients/screen-1
app.get('/clients/:uid/', function (request, response) {
  let dbo;
  let clientId = request.params.uid;
  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let screenClients = await dbo
        .collection(collectionName)
        .find({ id: clientId })
        .toArray();
      let client = screenClients[0];
      return response.status(200).json(client);
    });
  } catch (exception) {
    console.log(
      `Error while trying to get client: ${screenId} from DB`,
      exception
    );
    return response.status(400).send();
  }
});

/* --------------'Get client commercials'-------------- */ // e.g http://localhost/commercials/screen-1
// should be removed
app.get('/commercials/:uid/', function (request, response) {
  let dbo;
  let screenId = request.params.uid;

  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let screenClients = await dbo
        .collection(collectionName)
        .find({ id: screenId })
        .toArray();
      console.log(screenClients[0]);
      let screenClientCommercials = screenClients[0].commercials;
      return response.status(200).json(screenClientCommercials);
    });
  } catch (exception) {
    console.log(
      `Error while trying to get all commercials from client: ${screenId}`,
      exception
    );
    return response.status(400).send();
  }
});

/* --------------'Get commercial'-------------- */ // e.g http://localhost/8080/screen-1/1
// should be removed
app.get('/clients/:uid/commercials/:cid', function (request, response) {
  let dbo;
  let screenId = request.params.uid;
  let commercialId = parseInt(request.params.cid);
  let screenClientCommercial = null;
  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let screenClient = await dbo
        .collection(collectionName)
        .find({ id: screenId })
        .toArray();
      screenClientCommercial = screenClient[0].commercials.find(
        (x) => x.id == commercialId
      );
      if (!screenClientCommercial) {
        return response
          .status(404)
          .json(`Commercial with id: ${commercialId} not found`);
      }
      return response.status(200).json(screenClientCommercial);
    });
  } catch (exception) {
    console.log(
      `Error while trying to get commercial from client: ${screenId}`,
      exception
    );
    return response.status(400).send();
  }
});

/* --------------'Delete commercial'-------------- */ // e.g http://localhost/8080/screen-1/1
app.delete('/clients/:uid/commercials/:cid', function (request, response) {
  let dbo;
  let screenId = request.params.uid;
  let commercialId = request.params.cid;
  let commercialToDelete = null;
  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let screenClient = await dbo
        .collection(collectionName)
        .find({ id: screenId })
        .toArray();
      commercialToDelete = screenClient[0].commercials.find(
        (x) => x.id == commercialId
      );
      if (!commercialToDelete) {
        console.log(
          `Error while trying to delete commercial from client: ${screenId}`
        );
        return response.status(404).json({ success: false });
      }
      let screenClientCommercials = screenClient[0].commercials.filter(
        (x) => x.id != commercialId
      );
      dbo
        .collection(collectionName)
        .updateOne(
          { id: screenId },
          { $set: { commercials: screenClientCommercials } }
        );
      return response.status(200).json({
        success: true,
      });
    });
  } catch (exception) {
    console.log(
      `Error while trying to delete commercial from client: ${screenId}`,
      exception
    );
    return response.status(500).send();
  }
});

/* --------------'Add commercial'-------------- */ // e.g http://localhost/8080/screen-1 with body
app.post('/clients/:uid/commercials', function (request, response) {
  let dbo;
  let screenId = request.params.uid;
  let commercialResource = {
    id: uuid.v4(),
    ...request.body
  };

  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let screenClient = await dbo
        .collection(collectionName)
        .find({ id: screenId })
        .toArray();
      screenClient[0].commercials.push(commercialResource);
      let screenClientCommercials = screenClient[0].commercials;
      dbo
        .collection(collectionName)
        .updateOne(
          { id: screenId },
          { $set: { commercials: screenClientCommercials } }
        );

      return response.status(201).json({commercial: commercialResource});
    });
  } catch (exception) {
    console.log(
      `Error while trying to add commercial to client: ${screenId}`,
      exception
    );

    return response.status(500).send();
  }
});

/* --------------'Update commercial'-------------- */ // e.g http://localhost/8080/screen-1/1 //todo fix mongo updateOne
app.put('/clients/:uid/commercials/:cid', function (request, response) {
  let dbo;
  let screenId = request.params.uid;
  let commercialId = request.params.cid;
  let commercialResource = request.body;
  try {
    client.connect(async function (err, db) {
      dbo = db.db(databaseName);
      let screenClient = await dbo
        .collection(collectionName)
        .find({ id: screenId })
        .toArray();
      screenClient[0].commercials.find((x) => {
        if (x.id == commercialId) {
          x.title = commercialResource.title
            ? commercialResource.title
            : x.title;
          x.image = commercialResource.image
            ? commercialResource.image
            : x.image;
          x.interval = commercialResource.interval
            ? commercialResource.interval
            : x.interval;
        }
      });
      let screenClientCommercials = screenClient[0].commercials;
      dbo
        .collection(collectionName)
        .updateOne(
          { id: screenId },
          { $set: { commercials: screenClientCommercials } }
        );
    });
    return response.status(200).json({ commercial: commercialResource });
  } catch (exception) {
    console.log(
      `Error while trying to update commercial to client: ${screenId}`,
      exception
    );
    return response.status(400).send();
  }
});

function connectToSocket(response, clientId) {
  let dbo;
  let randID;

  io.sockets.on('connection', function (socket) {
    client.connect(function (err, db) {
      dbo = db.db(databaseName);
      let datetime = new Date().toString().slice(0, 24);
      randID = Math.trunc(Math.random() * 1000000) + 1;
      let obj = {
        id: randID,
        user: screenName,
        LoginTime: datetime,
        LogoutTime: 'Still connected',
      };
      console.log(`${clientId} connected!`);
      dbo.collection('usersData').insertOne(obj, function (err, res) {
        if (err) console.log(err);
      });

      dbo
        .collection(collectionName)
        .find({ id: clientId })
        .toArray(function (err, result) {
          if (err) console.log(err);

          socket.name = screenName;
          socket.emit('getScreen', result, screenName);
        });
    });
    /* ----------------- disconnect -------------- */
    myDisconnect(socket, dbo, randID);
  });
  response.sendFile(path.join(__dirname, '/screen.html'));
}

function myDisconnect(socket, dbo, randID) {
  socket.on('disconnect', function () {
    console.log(`${socket.name} disconnected!`);

    let datetime = new Date().toString().slice(0, 24);

    dbo
      .collection('usersData')
      .updateOne({ id: randID }, { $set: { LogoutTime: datetime } });
  });
}

function getAdmin(response) {
  response.sendFile(path.join(__dirname, '/admin.html'));
}
let newClients = [
  {
    name: 'Ido',
    id: '1',
    commercials: [
      {
        id: 1,
        title: 'Add 2',
        image:
          'https://www.hrus.co.il/wp-content/uploads/shutterstock_319097270.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      {
        id: 2,
        title: 'Add 2',
        image:
          'https://www.hrus.co.il/wp-content/uploads/shutterstock_319097270.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
    ],
    isActive: true,
  },
  {
    name: 'Lidor',
    id: '2',
    commercials: [
      {
        id: 1,
        title: 'Add 1',
        image:
          'https://www.hrus.co.il/wp-content/uploads/shutterstock_319097270.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      ,
      {
        id: 2,
        title: 'Add 1',
        image:
          'https://www.hrus.co.il/wp-content/uploads/shutterstock_319097270.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
    ],
    isActive: true,
  },
  {
    name: 'Nitzan',
    id: '3',
    commercials: [
      {
        id: 1,
        title: 'Add 1',
        image:
          'https://www.hrus.co.il/wp-content/uploads/shutterstock_319097270.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      ,
      {
        id: 2,
        title: 'Add 2',
        image:
          'https://www.hrus.co.il/wp-content/uploads/shutterstock_319097270.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
    ],
    isActive: true,
  },
];

let clients = [
  {
    id: '1',
    commercials: [
      {
        id: 1,
        title: 'Manchester City',
        image:
          'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/800px-Manchester_City_FC_badge.svg.png',
        duration: 5000,
      },
      {
        id: 2,
        title: 'Barcelona',
        image:
          'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
        duration: 3000,
      },
    ],
  },
  {
    id: '2',
    commercials: [
      {
        id: 1,
        title: 'NIKE',
        image:
          'https://blog.klekt.com/wp-content/uploads/2021/01/Nike-Dunk-Low-Team-Green-Feature.jpg',
        duration: 5000,
      },
      {
        id: 2,
        title: 'ADIDAS',
        image:
          'https://assets.adidas.com/images/w_600,f_auto,q_auto/c71df619024f4cc69405acfa0142a897_9366/Forum_Exhibit_Low_Shoes_White_GZ5389_01_standard.jpg',
        duration: 3000,
      },
    ],
  },
  {
    id: '3',
    commercials: [
      {
        id: 1,
        title: 'AUDI',
        image:
          'https://www.audi.co.il/wp-content/uploads/2020/11/DGT_110592_AudiNewSite_D2-2.jpg',
        duration: 3000,
      },
      {
        id: 2,
        title: 'MERCEDEZ',
        image:
          'https://www.mercedes-benz.co.il/wp-content/uploads/15C154_042-e1521967118774.jpg',
        duration: 5000,
      },
      {
        id: 3,
        title: 'BUGGATI',
        image:
          'https://cdn.motor1.com/images/mgl/6MGkl/s1/bugatti-chiron-pur-sport.webp',
        duration: 7000,
      },
    ],
  },
];
