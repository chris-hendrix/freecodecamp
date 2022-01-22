const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var board = 'testing'
  var text = 'Testing text'
  var delete_password = 'pw123'
  var thread_id = ''
  var reply_id = ''
  /*
  test('Title', done=> {
    var url = '' + board
    var query = {}
    chai.request(server)
      .get(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        done()
      })
  })
  */
  test('POST request to /api/threads/{board}', done=> {
    var url = '/api/threads/'+board
    var send = {text: text, delete_password: delete_password} 
    chai.request(server)
      .post(url)
      .send(send)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.body.text, text)
        thread_id = res.body._id
        done()
      })
  })

  test('GET request to /api/threads/{board}', done=> {
    var url = '/api/threads/' + board
    var query = {}
    chai.request(server)
      .get(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.isAtMost(res.body.length,10)
        done()
      })
  })

  test('PUT request to /api/threads/{board}', done=> {
    var url = '/api/threads/' + board
    var query = {thread_id: thread_id}
    chai.request(server)
      .put(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.body.reported, true)
        done()
      })
  })

  test('POST request to /api/replies/{board}', done=> {
    var url = '/api/replies/' + board
    var query = {thread_id: thread_id, text: text, delete_password: delete_password}
    chai.request(server)
      .post(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.body.replies.length, 1)
        reply_id = res.body.replies[0]._id
        done()
      })
  })

  test('GET request to /api/replies/{board}', done=> {
    var url = '/api/replies/' + board
    var query = {thread_id: thread_id}
    chai.request(server)
      .get(url)
      .query(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1)
        done()
      })
  })

  test('PUT request to /api/replies/{board}', done=> {
    var url = '/api/replies/' + board
    var query = {thread_id: thread_id, reply_id: reply_id}
    chai.request(server)
      .put(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.body.replies[0].reported, true)
        done()
      })
  })

  // --------------------- DELETE AT END -------------------------------------------------

  test('DELETE request to /api/replies/{board} with an invalid delete_password', done=> {
    var url = '/api/replies/' + board
    var query = {thread_id: thread_id, reply_id: reply_id, delete_password: 'wrong'}
    chai.request(server)
      .delete(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.notEqual(res.text, 'success')
        done()
      })
  })

  test('DELETE request to /api/replies/{board} with a valid delete_password', done=> {
    var url = '/api/replies/' + board
    var query = {thread_id: thread_id, reply_id: reply_id, delete_password: delete_password}
    chai.request(server)
      .delete(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success')
        done()
      })
  })

  test('DELETE request to /api/threads/{board} with an invalid delete_password', done=> {
    var url = '/api/threads/' + board
    var query = {thread_id: thread_id, delete_password: 'wrong'}
    chai.request(server)
      .delete(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.notEqual(res.text, 'success')
        done()
      })
  })

  test('DELETE request to /api/threads/{board} with a valid delete_password', done=> {
    var url = '/api/threads/' + board
    var query = {thread_id: thread_id, delete_password: delete_password}
    chai.request(server)
      .delete(url)
      .send(query)
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success')
        done()
      })
  })

  
});
