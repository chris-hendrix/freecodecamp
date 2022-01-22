'use strict';

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID


module.exports = function (app) {
  

  // POST request to /api/threads/{board}
  app.route('/api/threads/:board')
    .post((req,res)=>{
      var board = req.params.board
      var text = req.body.text
      var delete_password = req.body.delete_password

      //createTestThreads().then(doc=>console.log(doc)).catch(err=>console.log(err))
      
      createThread(board, text, delete_password)
        .then(doc => {
          res.json(doc.ops[0])
        })
        .catch(err => console.log(err))

    });


  // GET request to /api/threads/{board}
  app.route('/api/threads/:board')
   .get((req, res)=>{
     var board = req.params.board
     var threads = []

     getRecentThreads(board)
      .then(docs =>{
        docs.forEach(t=> {
          // delete specified thread keys
          delete t.delete_password
          delete t.reported
          // get latest 3 replies
          if(t.replies.length>3){t.replies = t.replies.slice(-3)}
          t.replies.forEach(r=> {
            // delete specified reply keys
            delete r.delete_password
            delete r.reported
          })
        })
        res.json(docs)
      })
      .catch(err=> console.log(err))
   })

  // DELETE request to /api/threads/{board}
  app.route('/api/threads/:board')
    .delete((req, res)=>{
      var board = req.params.board
      var thread_id = req.body.thread_id
      var delete_password = req.body.delete_password
      deleteThread(board, thread_id, delete_password)
        .then(doc=>{
          if(doc.deletedCount>0){
            res.send('success')
          }
          else {
            res.send('incorrect password')
          }
        })
        .catch(err => res.send('incorrect password'))
    })

  // PUT request to /api/threads/{board}
  app.route('/api/threads/:board')
    .put((req, res) => {
      var board = req.params.board
      var thread_id = req.body.thread_id

      updateThread(thread_id, {reported: true})
        .then(doc =>{
          if(doc.value==null) { res.send('invalid thread id') }
          res.json(doc.value)
        })
        .catch(err=> console.log(err))
    })

  // POST request to /api/replies/{board}
  app.route('/api/replies/:board')
    .post((req, res)=>{
      var board = req.params.board
      var text = req.body.text
      var delete_password = req.body.delete_password
      var thread_id = req.body.thread_id
      //var thread_id = '6068758b41d0ee02032f4db7' 
      //var board = 'replytest'

      reply(board, text, delete_password, thread_id)
        .then(doc=> {
          if(doc.value==null) { res.send('invalid thread id') }
          res.json(doc.value)
        })
        .catch(err=> console.log(err))
    })

    // DELETE request to /api/replies/{board}
    app.route('/api/replies/:board')
      .delete((req,res)=>{
        var board = req.params.board
        var thread_id = req.body.thread_id
        var reply_id = req.body.reply_id
        var delete_password = req.body.delete_password

        findOne({board: board, _id: ObjectID(thread_id)})
          .then(doc =>{
            var reply = doc.replies.find(r => r._id == reply_id)
            if (reply===undefined) {
              res.send('invalid thread id')
              return null
            }
            if (reply.delete_password !== delete_password) {
              res.send('invalid password')
              return null
            }
            doc.replies = doc.replies.filter(r=> r._id !== reply._id)
            return updateThread(thread_id, {replies: doc.replies})
          })
          .then(doc=>{
            if (doc !== null) {res.send('success')}      
          })
          .catch(err=>{
            console.log(err)
          })
      })
  

  // GET request to /api/replies/{board}?thread_id={thread_id}
  app.route('/api/replies/:board')
    .get((req, res)=>{
      var board = req.params.board
      var thread_id = req.query.thread_id
      findOne({board: board, _id: ObjectID(thread_id)})
        .then(doc => {
          if (doc._id==null) {res.send('invalid thread id')}
          doc.replies.forEach(x =>{
            delete x.delete_password
            delete x.reported
          })
          res.json(doc.replies)
        })
        .catch(err => res.send(err))
    })
  
  // PUT request to /api/replies/{board}
  app.route('/api/replies/:board')
      .put((req,res)=>{
        var board = req.params.board
        var thread_id = req.body.thread_id
        var reply_id = req.body.reply_id
        // var delete_password = req.body.delete_password
        findOne({board: board, _id: ObjectID(thread_id)})
          .then(doc =>{
            var reply = doc.replies.find(r => r._id == reply_id)
            if (reply===undefined) {res.send('no reply found')}
            reply.reported = true
            return updateThread(thread_id, {replies: doc.replies})
          })
          .then(doc=>{
            if (doc.value !== null) {
              res.json(doc.value)
            } 
          })
          .catch(err=>{
            res.send('no thread found')
          })
      })


  // ------------------- async functions -------------------------------
  // create thread
  async function createThread(board, text, delete_password){
    var thread = {
      board: board,
      text: text,
      delete_password: delete_password,
      created_on: getNow(),
      bumped_on: getNow(),
      reported: false,
      replies: []
    }
    var db = await connect('threads')
    return db.insertOne(thread)
  }

  // reply to thread
  async function reply(board, text, delete_password, thread_id){
    var reply = {
      _id: new ObjectID(),
      text: text,
      delete_password: delete_password,
      created_on: getNow(),
      reported: false
    }
    var db = await connect('threads').catch(err=> console.log(err))
    return db.findOneAndUpdate(
      {_id: ObjectID(thread_id)},
      {$set: {bumped_on: getNow()}, $addToSet: {replies: reply}},
      //{$set: {bumped_on: getNow()}},
      {returnOriginal: false}
    )
  }

  // get recent threads
  async function getRecentThreads(board){
    var db = await connect('threads').catch(err=> console.log(err))
    return db.find({board:board}).sort({bumped_on:-1}).limit(10).toArray()
  }

  // delete thread
  async function deleteThread(board, thread_id, delete_password){
    var db = await connect('threads').catch(err=> console.log(err))
    return db.deleteOne({board: board, _id: ObjectID(thread_id), delete_password: delete_password})
  }

  // update thread replies
  // reply to thread
  async function updateThread(thread_id, update){
    var db = await connect('threads').catch(err=> console.log(err))
    return db.findOneAndUpdate(
      {_id: ObjectID(thread_id)},
      {$set: update},
      //{$set: {bumped_on: getNow()}},
      {returnOriginal: false}
    )
  }


  // ------------------- other functions -------------------------------
  // general query function
  async function findOne(query){
    var db = await connect('threads').catch(err=> err)
    return db.findOne(query)
  }

  // connect to collection
  async function connect(collectionName){
    const client = await MongoClient
      .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
      .catch(err => { 
        console.log(err);
        return err
      });
    const db = client.db().collection(collectionName)
    return db
  }

  // custimizable date function
  function getNow(){
    return (new Date())
  }

  // create dummy threads
  async function createTestThreads(){
    var list = []
    for (var b=0; b<2; b++){
      for (var t=0; t<15; t++){
        var thread = {
          board: 'board'+b,
          text: 'text'+t,
          delete_password:'pw'+t,
          created_on: getNow(),
          bumped_on: getNow(),
          replies: []
        }
        list.push(thread)
        for (var r=0; r<5; r++){
          var reply = {
            _id: new ObjectID(),
            text: 'reply'+r,
            delete_password: 'pw'+r,
            created_on: getNow(),
            reported: false
          }
          thread.replies.push(reply)
        }
      }
    }

    var db = await connect('threads').catch(err=> err)
    return db.insertMany(list) 
  }

};
