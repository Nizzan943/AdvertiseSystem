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

/* --------------'localhost:8080/screen-x'-------------- */
app.get('/screens/:uid', function (request, response) {
  let id = request.params.uid;

  if (screensNamesArr.includes(id)) connectToSocket(response, id);
  else if (id === 'admin') getAdmin(response);
  else if (id === 'clients') getClients(response);
  else response.sendFile(path.join(__dirname, '/homePage.html'));
});

app.get('/clients', function (request, response) {
 getClients(response);
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
  console.log('client: ', clientId)
  let dbo;

  io.sockets.on('connection',(socket) => {
    client.connect(function (err, db) {
      dbo = db.db(databaseName);

      console.log(`${clientId} connected!`);

      dbo
      .collection(collectionName)
      .updateOne( 
        { id: clientId },
        { $set: { isActive: true } }
      );

      dbo
        .collection(collectionName)
        .find({ id: clientId })
        .toArray( (err, result) => {
          if (err) console.log(err);
          socket.name = clientId;
          socket.emit('screen', result[0], clientId);
        });
    });
    /* ----------------- disconnect -------------- */
    myDisconnect(socket, dbo);
  });
  response.sendFile(path.join(__dirname, '/screen.html'));
}

function myDisconnect(socket, dbo) {
  socket.on('disconnect', () => {
    const clientId = socket.name;

    console.log(`${clientId} disconnected!`);

    dbo
        .collection(collectionName)
        .updateOne(
            { id: clientId },
            { $set: { isActive: false } }
        );
  });
}

function getAdmin(response) {
  response.sendFile(path.join(__dirname, '/admin.html'));
}

const newClients = [
  {
    name: 'Cinema-City',
    id: '1',
    commercials: [
      {
        id: 1,
        title: 'Uncharted Movie',
        image:
            'https://upload.wikimedia.org/wikipedia/he/thumb/d/d3/Uncharted_Poster.jpg/800px-Uncharted_Poster.jpg',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      {
        id: 2,
        title: 'Moonfall',
        image:
            'https://upload.wikimedia.org/wikipedia/en/1/12/Moonfall2022Poster.jpg',
        duration: 3000,
        timeRange: {
          days: ['monday', 'friday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      {
        id: 3,
        title: 'Spiderman: No Way Home',
        image:
            'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg',
        duration: 3000,
        timeRange: {
          days: ['wednesday'],
          startHour: '1:21',
          endHour: '13:40',
        },
      },
    ],
    isActive: false,
  },
  {
    name: 'Super-Pharm',
    id: '2',
    commercials: [
      {
        id: 1,
        title: 'Coco Chanel',
        image:
            'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      {
        id: 2,
        title: 'Versace Eros',
        image:
            'https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40'
        },
      },
      {
        id: 3,
        title: 'Yves Saint Laurent',
        image:
            'https://images.unsplash.com/photo-1588482587611-692b19ee797b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
    ],
    isActive: false,
  },
  {
    name: 'Car-dealership',
    id: '3',
    commercials: [
      {
        id: 1,
        title: 'Mustang GT500',
        image:
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      {
        id: 2,
        title: 'Porchse Panamera Turbo',
        image:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
      {
        id: 3,
        title: 'Blue Chevy Camero RS',
        image:
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        duration: 3000,
        timeRange: {
          days: ['sunday', 'tuesday'],
          startHour: '10:21',
          endHour: '13:40',
        },
      },
    ],
    isActive: false,
  },
];
