const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

/*
POST request to /api/solve
  1   Solve a puzzle with valid puzzle string: POST request to /api/solve
  2   Solve a puzzle with missing puzzle string: POST request to /api/solve
  3   Solve a puzzle with invalid characters: POST request to /api/solve
  4   Solve a puzzle with incorrect length: POST request to /api/solve
  5   Solve a puzzle that cannot be solved: POST request to /api/solve
POST request to /api/check
  6   Check a puzzle placement with all fields: POST request to /api/check
  7   Check a puzzle placement with single placement conflict: POST request to /api/check
  8   Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  9   Check a puzzle placement with all placement conflicts: POST request to /api/check
  10  Check a puzzle placement with missing required fields: POST request to /api/check
  11  Check a puzzle placement with invalid characters: POST request to /api/check
  12  Check a puzzle placement with incorrect length: POST request to /api/check
  13  Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  14  Check a puzzle placement with invalid placement value: POST request to /api/check
*/
const Solver = require('../controllers/sudoku-solver.js');
const puzzles = require('../controllers/puzzle-strings.js')
const puzzlesAndSolutions = puzzles.puzzlesAndSolutions;
const invalidPuzzles = puzzles.invalidPuzzles;
let solver;

suite('Functional Tests', () => {

  suiteSetup(done => {
    solver = new Solver();
    done();
  });

  suite('POST request to /api/solve', function() {
    // 1
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var send = {puzzle: puzzle}
      chai.request(server)
        .post('/api/solve')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(res.body.solution,null)
          done();
        })
    });
    // 2
    test('Solve a puzzle with missing puzzle string', function(done) {
      var send = {}
      chai.request(server)
        .post('/api/solve')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(res.body.error,null)
          done();
        })
    });
    // 3
    test('Solve a puzzle with invalid characters', function(done) {
      var puzzle = '0.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var send = {puzzle: puzzle}
      chai.request(server)
        .post('/api/solve')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(res.body.error,null)
          done();
        })
    });
    // 4
    test('Solve a puzzle with incorrect length', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1'
      var send = {puzzle: puzzle}
      chai.request(server)
        .post('/api/solve')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(res.body.error,null)
          done();
        })
    });
    // 5
    test('Solve a puzzle that cannot be solved', function(done) {
      var puzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var send = {puzzle: puzzle}
      chai.request(server)
        .post('/api/solve')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(res.body.error,null)
          done();
       })
    });

  }); // end suite

  suite('POST request to /api/check', function() {
    // 6
    test('Check a puzzle placement with all fields', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'A1'
      var value = '7'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.equal(JSON.parse(res.text).valid, true)
          done();
        })
    });
    // 7
    test('Check a puzzle placement with single placement conflict', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'A1'
      var value = '6'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.equal(JSON.parse(res.text).conflict.length, 1)
          done();
        })
    });
    // 8
    test('Check a puzzle placement with multiple placement conflicts', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'A1'
      var value = '1'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.isAtLeast(JSON.parse(res.text).conflict.length, 2)
          done();
        })
    });
    // 9
    test('Check a puzzle placement with all placement conflicts', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'A1'
      var value = '5'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.isAtLeast(JSON.parse(res.text).conflict.length, 3)
          done();
        })
    });
    // 10
    test('Check a puzzle placement with missing required fields', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var send = {puzzle: puzzle}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(JSON.parse(res.text).error,null)
          done();
        })
    });
    // 11
    test('Check a puzzle placement with invalid characters', function(done) {
      var puzzle = '0.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'A1'
      var value = '7'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(JSON.parse(res.text).error,null)
          done();
        })
    });
    // 12
    test('Check a puzzle placement with incorrect length', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..9'
      var coord = 'A1'
      var value = '7'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(JSON.parse(res.text).error,null)
          done();
        })
    });
    // 13
    test('Check a puzzle placement with invalid placement coordinate', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'JK'
      var value = '7'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(JSON.parse(res.text).error,null)
          done();
        })
    });
    // 14
    test('Check a puzzle placement with invalid placement value', function(done) {
      var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      var coord = 'A1'
      var value = '10'
      var send = {puzzle: puzzle, coordinate: coord, value: value}
      chai.request(server)
        .post('/api/check')
        .send(send)
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.notEqual(JSON.parse(res.text).error,null)
          done();
        })
    });

  }); // end suite

});

