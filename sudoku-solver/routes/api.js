'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  var lets = ['A','B','C','D','E','F','G','H','I']
  var nums = ['1','2','3','4','5','6','7','8','9']

  app.route('/api/check')
    .post((req, res) => {

      // get coordinate, puzzleString
      var coord = req.body.coordinate
      var puzzle = req.body.puzzle
      var value = req.body.value;
      var error;

      // validate
      var validate = solver.validate(puzzle)
      if(validate.error){ res.json(validate) }

      // error if missing fields
      if(coord==null || puzzle==null || value==null){
        error= { error: 'Required field(s) missing' }
        res.json(error)
      }

      // error if coordinate length !==2
      if (coord.length!==2){
        error = { error: 'Invalid coordinate'}
        res.json(error)
      }
      
      // get row and column coordinates
      var row = lets.indexOf(coord[0].toUpperCase())
      var col = nums.indexOf(coord[1])

      // error if invalid coordinates
      if (row===-1 || col===-1){
        error = { error: 'Invalid coordinate'}
        res.json(error)
      }

      // error if invalid value
      if(nums.indexOf(value)===-1){
        error = { error: 'Invalid value' }
        res.json(error)
      }

      // check row placement
      var conflict = []
      var isValid = true
      if (!solver.checkRowPlacement(puzzle,row,col,value)){
        isValid=false
        conflict.push('row')
      }

      // check column placement
      if (!solver.checkColPlacement(puzzle,row,col,value)){
        isValid=false
        conflict.push('column')
      }

      // check region plaacement
      if (!solver.checkRegionPlacement(puzzle,row,col,value)){
        isValid=false
        conflict.push('region')
      }
      var result = {valid: isValid}
      if (conflict.length>0) {result.conflict=conflict}
      res.json(result)
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      var puzzle = req.body.puzzle
      var error;

      // error if puzzle is missing
      if (puzzle==null){
        error = { error: 'Required field missing' }
        res.json(error)
      }

      // solve puzzle
      var result = solver.solve(puzzle)
      res.json(result)
    });
};
