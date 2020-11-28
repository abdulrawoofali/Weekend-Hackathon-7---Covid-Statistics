const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;

const LOCAL_HOST = "http://localhost:8080";

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { connection } = require("./connector");

app.get(`/totalRecovered`, (req, res) => {
  // let sum =0 ;
  // connection.find().then(stats => {
  //     stats.forEach(stat => {
  //         sum+=stat.recovered;
  //     });
  //     res.send({data: {_id: "total", recovered:sum}});
  // });

  connection
    .aggregate([
      {
        $group: {
          _id: "total",
          recovered: {
            $sum: "$recovered",
          },
        },
      },
    ])
    .exec()
    .then((result) => {
      (result._doc_id = "total"), res.send({ data: result });
    });
});

app.get(`/totalActive`, (req, res) => {
  connection
    .aggregate([
      {
        $group: {
          _id: "total",
          active: {
            $sum: {
              $subtract: ["$infected", "$recovered"],
            },
          },
        },
      },
    ])
    .exec()
    .then((result) => {
      (result._doc_id = "total"), res.send({ data: result });
    })
    .catch((err) => console.log(err));
});

app.get(`/totalDeath`, (req, res) => {
  connection
    .aggregate([
      {
        $group: {
          _id: "total",
          death: {
            $sum: "$death",
          },
        },
      },
    ])
    .exec()
    .then((result) => {
      (result._doc_id = "total"), res.send({ data: result });
    });
});

app.get(`/hotspotStates`, (req, res) => {
  connection
    .aggregate([
      {
        $project: {
          _id: 0,
          state: "$state",
          rate: {
            $round: [
              { $subtract: [1, { $divide: ["$recovered", "$infected"] }] },
              5,
            ],
          },
        },
      },
      {
        $match: {
          rate: { $gt: 0.1 },
        },
      },
    ])
    .exec()
    .then((result) => {
      (result._doc_id = "total"), res.send({ data: result });
    })
    .catch((err) => console.log("sm error....", err));
});

app.get(`/healthyStates`, (req, res) => {
  connection
    .aggregate([
      {
        $project: {
          _id: 0,
          state: "$state",
          mortality: { $round: [{ $divide: ["$death", "$infected"] }, 5] },
        },
      },
      {
        $match: {
          mortality: { $lt: 0.005 },
        },
      },
    ])
    .exec()
    .then((result) => {
      (result._doc_id = "total"), res.send({ data: result });
    })
    .catch((err) => console.log("sm error....", err));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
