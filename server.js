import express from "express";
import minimist from "minimist";
import Database from "better-sqlite3";
import { __esModule } from "node-fetch";

//Database Initialization
const db = new Database("database.db");
db.pragma("journal_mode = WAL");

//Global Variables for Functionality
var loggedIn = null; //Currently logged in user
var currUserScore = 0; //Current User Score
var currCompScore = 0; //Current Computer Score

////////////////////////////Database Setup///////////////////////////////////////
const createUserTable = `CREATE TABLE Users (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(100), Email VARCHAR(255), UserName VARCHAR(64), Password VARCHAR(64));`;
const createLeaderTable = `CREATE TABLE Leaderboard (ID INTEGER PRIMARY KEY AUTOINCREMENT, UserName VARCHAR(64), Highest_Score INTEGER);`;
const createLogsTable = `CREATE TABLE Logs (ID INTEGER PRIMARY KEY AUTOINCREMENT, UserName VARCHAR(64), Message VARCHAR, Time VARCHAR);`;

try {
  db.exec(createUserTable);
} catch (error) {}

try {
  db.exec(createLeaderTable);
} catch (error) {}

try {
  db.exec(createLogsTable);
} catch (error) {}

////////////////////////////////// SERVER SETUP ////////////////////////////////////
const app = express();
const args = minimist(process.argv.slice(2));
const port = args.port || 2000;

//link server.js page with css styles
app.use(express.static("/public"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/img"));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.redirect("/login");
});

//////////////////////////////////// USER ACCOUNT FEATURES ////////////////////////////
app.get("/login", function (req, res) {
  if (loggedIn) {
    res.redirect("/home");
    console.log("[LOGIN LOADED]")
  }
  else {
    res.render("login");
    console.log("[LOGIN LOADED]")
  }
});

app.get("/register", function (req, res) {
  res.render("register");
  console.log("[REGISTER LOADED]");
});

app.get("/home", function (req, res) {
  if (loggedIn){
    res.render("home", { loggedIn: loggedIn });
    console.log("[HOME LOADED]");
    //I dont know how the html pages are being accessed so how do you load them with different js.scripts
  } 
  else { res.redirect("/login"); }
});

//LOGIN TO ACCOUNT
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const time = Date.now();
  const now = new Date(time);
  //Check if user exists in database
  const checkUsername = db.prepare(
    `SELECT * FROM Users WHERE UserName='${username}'`
  );
  let result = checkUsername.get();

  if (result == undefined) {
    //USERNAME DOES NOT EXIST
    console.log("USERNAME DOES NOT EXIST");
  } else {
    const checkPass = db.prepare(
      `SELECT * FROM Users WHERE UserName='${username}' and Password='${password}'`
    );
    let Pass = checkPass.get();
    if (Pass == undefined) {
      //Wrong Password
      console.log("WRONG PASSWORD");
      const logLoginFailure = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${username}', 'failed to login due to wrong password', '${now.toISOString()}');`;
      db.exec(logLoginFailure);
    } else {
      //LOGIN SUCCESSFUL
      const logLoginSuccess = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${username}', 'logged in successfully', '${now.toISOString()}');`;
      db.exec(logLoginSuccess);

      loggedIn = username;
      currUserScore = 0;
      currCompScore = 0;
      res.redirect("/home");
    }
  }
});

//CREATE A NEW ACCOUNT
app.post("/register", function (req, res) {
  //Variables for the input parameters
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  //Check if username exists in database
  const checkUsername = db.prepare(
    `SELECT * FROM Users WHERE UserName='${username}'`
  );
  let result = checkUsername.get();

  if (result === undefined) {
    const newAcc = `INSERT INTO Users (Name, Email, UserName, Password) VALUES ('${name}', '${email}', '${username}', '${password}');`;
    db.exec(newAcc);
    const minScore = 0;
    const newAccLB = `INSERT INTO Leaderboard (UserName, Highest_Score) VALUES ('${username}', '${minScore}');`;
    db.exec(newAccLB);
    const time = Date.now();
    const now = new Date(time);
    const logAccCreate = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${username}', 'created a new account', '${now.toISOString()}');`;
    try {
      db.exec(logAccCreate);
    } catch (error) {
      console.log(error);
    }
    res.render("login");
  } else {
    console.log("Username Exists");
  }
});

//DELETE EXISTING ACCOUNT
app.post("/delete-account", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const time = Date.now();
  const now = new Date(time);

  //Check if username exists in database
  const checkUsername = db.prepare(
    `SELECT * FROM Users WHERE UserName='${username}'`
  );
  let result = checkUsername.get();

  if (result == undefined) {
    //USERNAME DOES NOT EXIST
    console.log("USERNAME DOES NOT EXIST");
  } else {
    const getPass = db.prepare(
      `SELECT * FROM Users WHERE UserName='${username}' and Password='${password}'`
    );
    let Pass = getPass.get();
    if (Pass == undefined) {
      //WRONG PASSWORD
      const logDeleteFailure = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${username}', 'failed to delete due to wrong password', '${now.toISOString()}');`;
      db.exec(logDeleteFailure);
    } else {
      //PASSWORD VERIFICATION SUCCESS
      const delAcc = `DELETE FROM Users WHERE UserName='${username}'`;
      db.exec(delAcc);
      const delAccLB = `DELETE FROM Leaderboard WHERE UserName='${username}'`;
      db.exec(delAccLB);
      const logDeleteSuccess = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${username}', 'deleted their account', '${now.toISOString()}');`;
      db.exec(logDeleteSuccess);
      res.redirect("/login");
    }
  }
});

//LOGOUT OF CURRENT ACCOUNT
app.post("/logout", function (req, res) {
  const time = Date.now();
  const now = new Date(time);
  const logLogout = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${username}', 'logged out', '${now.toISOString()}');`;
  db.exec(logLogout);
  loggedIn = null;
  res.redirect("/login");
});

////////////////////////////////////////// GAME FEATURES ///////////////////////////////
//Play Game
app.post("/play_game", function (req, res) {
  const winner = req.body.winner;
  const rock = req.body.rock;
  console.log(rock);
  //Add this depending on how the frontend logic works
  if (winner == 0) {
  } else {
  }
  /*
  // const userInput = req.body.input; // Rock, paper or scissors
  // const randInt = Math.floor(Math.random() * 3); // Random integer between 0 to 2
  // const compInput = null;
  // if (randInt == 0) compInput = "rock";
  // else if (randInt == 1) compInput = "paper";
  // else compInput = "scissors";

  // if (
  //   (compInput == "rock" && userInput == "scissors") ||
  //   (compInput == "paper" && userInput == "rock") ||
  //   (compInput == "scissors" && userInput == "paper")
  // ) {
  //   currCompScore++;
  //   const logGame = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${loggedIn}', 'played the game and lost', '${now.toISOString()}');`;
  //   db.exec(logGame);
  // } else {
  //   currUserScore++;
  //   const logGame = `INSERT INTO Logs (UserName, Message, Time) VALUES ('${loggedIn}', 'played the game and won', '${now.toISOString()}');`;
  //   db.exec(logGame);

  //   //Update database with new high score if current score is higher than before
  //   const currScore = currUserScore - currCompScore;
  //   const getScore = db.prepare(
  //     `SELECT Highest_Score FROM Leaderboard WHERE UserName='${loggedIn}'`
  //   );
  //   let highScore = getScore.get();
  //   if (currScore > highScore) {
  //     const updateScore = `INSERT INTO Leaderboard (UserName, Highest_Score) VALUES ('${loggedIn}', '${currScore}');`;
  //     db.exec(updateScore);
  //   }
  // }
  */
});

////////////////////////////////////////// DATABASE FEATURES ///////////////////////////
//RETRIEVE USERS DB
app.get("/users_db", function (req, res) {
  const getUsers = db.prepare(`SELECT * FROM Users;`);
  let result = getUsers.all();

  if (result === undefined) {
    //CREATE PAGES TO RENDER
    // res.send('nothing in db');
  } else {
    // res.send(all);
  }
});

//RETRIEVE LEADERBOARD DB
app.get("/leaderboard_db", function (req, res) {
  const getBoard = db.prepare(`SELECT * FROM Leaderboard;`);
  let result = getBoard.all();

  if (result === undefined) {
    // res.send('nothing in db');
  } else {
    // res.send(all);
  }
});

//RETRIEVE LOGS DB
app.get("/logs_db", function (req, res) {
  const getLogs = db.prepare(`SELECT * FROM Logs;`);
  let result = getLogs.all();

  if (result === undefined) {
    // res.send('nothing in db');
  } else {
    // res.send(all);
  }
});

app.listen(port);
