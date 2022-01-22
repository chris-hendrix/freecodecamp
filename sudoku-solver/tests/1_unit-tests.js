const chai = require('chai');
const assert = chai.assert;
const puzzles = require('../controllers/puzzle-strings.js')

/*
1   Logic handles a valid puzzle string of 81 characters
2   Logic handles a puzzle string with invalid characters (not 1-9 or .)
3   Logic handles a puzzle string that is not 81 characters in length
4   Logic handles a valid row placement
5   Logic handles an invalid row placement
6   Logic handles a valid column placement
7   Logic handles an invalid column placement
8   Logic handles a valid region (3x3 grid) placement
9   Logic handles an invalid region (3x3 grid) placement
10  Valid puzzle strings pass the solver
11  Invalid puzzle strings fail the solver
12  Solver returns the the expected solution for an incomplete puzzzle
*/

const Solver = require('../controllers/sudoku-solver.js');
const puzzlesAndSolutions = puzzles.puzzlesAndSolutions

let solver;

suite('UnitTests', () => {

  suiteSetup(done => {
    solver = new Solver();
    done();
  });
  // 1
  test('Logic handles a valid puzzle string of 81 characters', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    var validate = solver.validate(puzzle);
    assert.equal(validate.error, null);
    done();
  });
  // 2
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..0..';
    var validate = solver.validate(puzzle);
    assert.equal(validate.error,'Invalid characters in puzzle');
    done();
  });
  // 3
  test('Logic handles a puzzle string that is not 81 characters in length', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var validate = solver.validate(puzzle);
    assert.equal(validate.error,'Expected puzzle to be 81 characters long');
    done();
  });
  // 4 
  test('Logic handles a valid row placement', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var check = solver.checkRowPlacement(puzzle,0,0,7);
    assert.equal(check,true);
    done();
  });
  // 5 
  test('Logic handles an invalid row placement', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var check = solver.checkRowPlacement(puzzle,0,0,9);
    assert.equal(check,false);
    done();
  });
  // 6
  test('Logic handles a valid column placement', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var check = solver.checkColPlacement(puzzle,0,0,7);
    assert.equal(check,true);
    done();
  });
  // 7
  test('Logic handles an invalid column placement', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var check = solver.checkColPlacement(puzzle,0,0,8);
    assert.equal(check,false);
    done();
  });
  // 8
  test('Logic handles a valid region (3x3 grid) placement', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var check = solver.checkRegionPlacement(puzzle,0,0,7);
    assert.equal(check,true);
    done();
  });
  // 9
  test('Logic handles an invalid region (3x3 grid) placement', (done)=> {
    var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1';
    var check = solver.checkRegionPlacement(puzzle,0,0,9);
    assert.equal(check,false);
    done();
  });
  // 10
  test('Valid puzzle strings pass the solver', (done)=> {
    var puzzle;
    var solution;
    for (var i = 0; i < puzzles.length; i++){
      puzzle = puzzles[i][0]
      solution = puzzles[i][1]
      assert.equal(solver.validate(puzzle).error, null)
    }
    done();
  });
  // 11
  test('Invalid puzzle strings fail the solver', (done)=> {
    var invalidPuzzles = [
      '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..1', // length
      '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.0', // character
      '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' // unsolvable
    ]
    var puzzle;
    for (var i =0; i<invalidPuzzles.length; i++){
      puzzle=invalidPuzzles[i];
      assert.notEqual(solver.solve(puzzle).error,null)
    }
    done();
  });
  // 12
  test('Solver returns the the expected solution for an incomplete puzzzle', (done)=> {
    var puzzle;
    var solution;
    for (var i = 0; i < puzzles.length; i++){
      puzzle = puzzles[i][0]
      solution = puzzles[i][1]
      assert.equal(solver.solve(puzzle).solution, solution)
    }
    done();
  });
});
