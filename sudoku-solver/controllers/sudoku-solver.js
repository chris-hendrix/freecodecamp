class SudokuSolver {


  validate(puzzleString) {
    // check if invalid characters
    if(puzzleString.match(/[^1-9\.]/g)) {
      return { error: 'Invalid characters in puzzle' };
    }

    // check if 81 characters
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    }

    return {status : 'valid'}
  }

  checkRowPlacement(puzzleString, row, column, value) {

    // get index 
    var index = row*9 + column

    // check if value already exists
    if(puzzleString.charAt(index)!='.'){
      return false
    }

    // check if value is in row
    var rowString = puzzleString.substring(row*9,row*9+8)

    // error if string includes value
    if (rowString.includes(value)) {return false}

    // return true
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    // get index 
    var index = row*9 + column

    // check if value already exists
    if(puzzleString.charAt(index)!='.'){return false}

    // check if value is in column
    var colString=''
    for(var i=0; i<puzzleString.length; i++){
      if(i%9==column){ colString += puzzleString.charAt(i) }
    }

    // error if string includes value
    if (colString.includes(value)) { return false }

    // return true
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // get index 
    var index = row*9 + column
    // check if value already exists
    if(puzzleString.charAt(index) !='.'){return false}

    // get start/end of row and column
    var row0 = Math.floor(row/3)*3
    var row1 = row0+2
    var col0 = Math.floor(column/3)*3
    var col1 = col0+2

    // get region string
    var regionString =''
    for (var i=row0; i<=row1; i++) {
      for(var j=col0; j<=col1; j++) {
        index = i*9+j
        regionString += puzzleString.charAt(index) 
      }
    }

    // error if string includes value
    if (regionString.includes(value)) {return false}

    return true
  }

  solve(puzzleString) {
    //https://en.wikipedia.org/wiki/Sudoku_solving_algorithms
      //1. Briefly, a program would solve a puzzle by placing the digit "1" in the first cell and checking if it is allowed to be there.
      //2. If there are no violations (checking row, column, and box constraints) then the algorithm advances to the next cell and places a "1" in that cell. 
      //3. When checking for violations, if it is discovered that the "1" is not allowed, the value is advanced to "2". 
      //4. If a cell is discovered where none of the 9 digits is allowed, then the algorithm leaves that cell blank and moves back to the previous cell. 
      //5. The value in that cell is then incremented by one. 
      //6. This is repeated until the allowed value in the last (81st) cell is discovered

    // validate puzzle
    var validate = this.validate(puzzleString)
    if(validate.error){ return validate }

    // set variables
    var index = 0;
    var answer = puzzleString
    var forward = true 
    var val;

    // start loop, end at specified iterations
    for (var i = 0; i<=10000; i++) {
      
      //console.log('index='+index + ' answer=' + answer)
      
      // break if index less than zero
      if (index<0){ break }

      // get value at index from answer string
      val = answer.charAt(index)
      if(puzzleString.charAt(index)=='.'){

        // try to find next available number
        val = this.findNextValue(answer, index, val)
        
        if(val>0){
          // set new value if answer found
          answer = answer.substring(0,index) + val.toString() + answer.substring(index+1)

          // return answer if at end
          if (index==answer.length-1){
            return {solution: answer}
          }

          //move to next index
          forward = true
          index +=1
        }
        else{
          // move to previous number if no answer
          answer = answer.substring(0,index) + '.' + answer.substring(index+1)
          forward = false
          index -=1
        }
      }
      else{
        // move forward or backward if number exists
        index = (forward) ? index + 1 : index - 1
      }


    }
    return { error: 'Puzzle cannot be solved' }
  }

  findNextValue(answer, index, value){

    // start number is input value, or one if "."
    answer = answer.substring(0,index) + '.' + answer.substring(index+1)
    var start = (value=='.') ? 1 : parseInt(value) + 1 

    // find next value that works
    for (var val = start; val<=9; val++) {
      if(this.checkPlacement(answer, index, val)){
        return val
      }
    }
    //return -1 if no solution
    return -1;
  }

  checkPlacement(puzzleString, index, value) {

    // convert index to row and col
    var col = index % 9;
    var row = Math.floor(index/9)

    // return true if all checks return true
    return this.checkRowPlacement(puzzleString,row,col,value) && 
      this.checkColPlacement(puzzleString,row,col,value) &&
      this.checkRegionPlacement(puzzleString,row,col,value)
  }
}

module.exports = SudokuSolver;

