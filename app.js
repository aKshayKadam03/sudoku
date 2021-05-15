document.getElementById("question").placeholder = `0 4 0 0 0 0 1 7 9
0 0 2 0 0 8 0 5 4
0 0 6 0 0 5 0 0 8
0 8 0 0 7 0 9 1 0
0 5 0 0 9 0 0 3 0
0 1 9 0 6 0 0 4 0
3 0 0 4 0 0 7 0 0
5 7 0 1 0 0 2 0 0
9 2 8 0 0 0 0 6 0`;
let board = document.getElementById("board");
let backupPlan = [
  [0, 4, 0, 0, 0, 0, 1, 7, 9],
  [0, 0, 2, 0, 0, 8, 0, 5, 4],
  [0, 0, 6, 0, 0, 5, 0, 0, 8],
  [0, 8, 0, 0, 7, 0, 9, 1, 0],
  [0, 5, 0, 0, 9, 0, 0, 3, 0],
  [0, 1, 9, 0, 6, 0, 0, 4, 0],
  [3, 0, 0, 4, 0, 0, 7, 0, 0],
  [5, 7, 0, 1, 0, 0, 2, 0, 0],
  [9, 2, 8, 0, 0, 0, 0, 6, 0],
];
let arr;
let backup;
function getSudokuPuzzle() {
  fetch("https://sugoku.herokuapp.com/board?difficulty=random")
    .then((res) => res.json())
    .then((data) => setState(data.board))
    .catch((err) => setState(backupPlan));
}
getSudokuPuzzle();

function setState(data) {
  arr = data;
  boardCreation(arr);
  backup = JSON.parse(JSON.stringify(arr));
}

let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", solveChecker);

let submitQuestion = document.getElementById("submitQuestion");
submitQuestion.addEventListener("click", questionSubmitHandler);

let resetButton = document.getElementById("reset");

resetButton.addEventListener("click", resetBoard);

//------------------------------  modules ---------------------------------
function resetBoard() {
  fetch("https://sugoku.herokuapp.com/board?difficulty=random")
    .then((res) => res.json())
    .then((data) => boardManipulation(data.board))
    .catch((err) => boardManipulation(backupPlan));
}

//initial Board creation
function boardCreation(arr) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let input = document.createElement("input");
      input.setAttribute("class", "cell");
      let key = [i, j];
      input.setAttribute("id", key);
      input.setAttribute("type", "number");
      input.setAttribute("max", 9);
      input.setAttribute("min", 1);
      input.addEventListener("change", onChangeHandler);
      if (arr[i][j] !== 0) {
        input.value = arr[i][j];
      }
      if (input.value !== "") {
        input.setAttribute("disabled", true);
      }
      board.appendChild(input);
    }
  }
}

//input change handler
function onChangeHandler(e) {
  let id = e.target.id;
  arr[id[0]][id[2]] = +e.target.value;
}

//display new input on board
function questionSubmitHandler() {
  arr = inputHandler();
  backup = [...arr];
  if (arr.length === 9) {
    if (arr[0].length === 9) {
      boardManipulation(arr);
    } else {
      alert("Please input a valid array");
    }
  } else {
    alert("Please input a valid array");
  }
}

function boardManipulation(array) {
  arr = array;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let key = [i, j];
      let input = document.getElementById(key);
      input.removeAttribute("disabled");
      input.value = array[i][j];
      if (array[i][j] !== 0) {
        input.value = array[i][j];
      } else {
        input.value = "";
      }
      if (input.value !== "") {
        input.setAttribute("disabled", "true");
      }
    }
  }
}

//input handler for incoming question
function inputHandler() {
  let questionInput = document.getElementById("question").value;
  if (!questionInput.trim()) {
    return alert("Cannot be empty");
  }
  let questionArray = [];
  let count = 0;
  let temp = [];
  for (let i = 0; i < questionInput.length; i++) {
    if (questionInput[i].trim()) {
      temp.push(+questionInput[i]);
      count++;
      if (count === 9) {
        questionArray.push(temp);
        temp = [];
        count = 0;
      }
    }
  }
  return questionArray;
}

//solution checker

function solveChecker() {
  for (let i = 0; i < arr.length; i++) {
    let objOne = {};
    let objTwo = {};
    for (let j = 0; j < arr.length; j++) {
      objOne[arr[i][j]] = 1;
      objTwo[arr[j][i]] = 1;
    }

    if (Object.keys(objOne).length !== 9 || Object.keys(objTwo).length !== 9) {
      return alert("Aww!! Try Again");
    }
  }

  return successCelebrations();
}

// sudoku solver

let solverButton = document.getElementById("solver");
solverButton.addEventListener("click", sudokuSolver);

function sudokuSolver() {
  arr = [...backup];
  const emptyCells = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  function isSafe(row, col, currentChoice) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[row][i] === currentChoice) {
        return false;
      }
      if (arr[i][col] === currentChoice) {
        return false;
      }
      r = Math.floor(row / 3) * 3;
      c = Math.floor(col / 3) * 3;
      for (let i = r; i < r + 3; i++) {
        for (let j = c; j < c + 3; j++) {
          if (arr[i][j] === currentChoice) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function sudoku(current) {
    if (current === emptyCells.length) {
      return true;
    }
    let [row, col] = emptyCells[current];
    for (let i = 1; i < 10; i++) {
      if (isSafe(row, col, i)) {
        arr[row][col] = i;
        if (sudoku(current + 1)) {
          return true;
        }
        arr[row][col] = 0;
      }
    }
    return false;
  }
  // console.table(arr);
  if (sudoku(0)) {
    return boardManipulation(arr);
  } else {
    alert("there is no solution for this puzzle");
  }
}

//celebration
function successCelebrations() {
  let celebrations = document.getElementById("celebration");
  celebrations.style.display = "inline";
  setTimeout(() => {
    celebrations.style.display = "none";
  }, 2000);
}
