
// XXX-T
// The last character is not using for this section, so I get rid of that
// XXXXT

class GameItem{
    constructor(str, winNum = 0, lostNum = 0, maxContinuesWin = 0, maxContinuesLost = 0) {
        this.str = str;
        if (str.length >= 2) {
            this.base = str.substring(0, str.length - 1);
            this.dectect = str[str.length - 1];
        } else {
            throw Error("Chuỗi không đủ độ dài!");
        }
        this.winNum = winNum;
        this.lostNum = lostNum;
        this.maxContinuesWin = maxContinuesWin;
        this.maxContinuesLost = maxContinuesLost;
    }
}

let copiedData = "";
// Continues by value 
let smallerThan = "1";
let largerThan = "2";
let extractNum = "3";
let ignoreThis = "4";

const smallerThanFunc = (num, compareTo) => {
    return num <= compareTo;
}

const largerThanFunc = (num, compareTo) => {
    return num >= compareTo;
}

const extractNumFunc = (num, compareTo) => {
    return num == compareTo;
}

const ignoreThisFunc = (num, compareTo) => {
    return true;
}

// Filter by value
let all = "0";
let both = "1";
let justWin = "2";
let justLose = "3";
let bothNotContinues = "4"
let justWinNotContinues = "5";
let justLoseNotContinues = "6";
let neither = "7";

const allFunc = (func, item, num) => {
    if (func(item.maxContinuesWin, num) || func(item.maxContinuesLost, num) || func(item.winNum, num) || func(item.lostNum, num))
        return true;
    return false;
}

const bothFunc = (func, item, num) => {
    if (func(item.maxContinuesWin, num) && func(item.maxContinuesLost, num)) 
        return true;
    return false;
}

const justWinFunc = (func, item, num) => {
    if (func(item.maxContinuesWin, num))
        return true;
    return false;
};

const justLoseFunc = (func, item, num) => {
    if (func(item.maxContinuesLost, num))
        return true;
    return false;
}

const bothNotContinuesFunc = (func, item, num) => {
    if (func(item.winNum, num) || func(item.lostNum, num))
        return true;
    return false;
}

const justWinNotContinuesFunc = (func, item, num) => {
    if (func(item.winNum, num))
        return true;
    return false;
}

const justLoseNotContinuesFunc = (func, item, num) => {
    if (func(item.lostNum, num))
        return true;
    return false;
}

const neitherFunc = (func, item, num) => {
    if (func(item.maxContinuesWin, num) || func(item.maxContinuesLost, num))
        return true;
    return false;
}

// Game state
let winState = 1;
let loseState = -1;
let noneState = 0;

function run() {
    let inputString = document.querySelector("#input-text").value;
    let fromLength = parseInt(document.querySelector("#fromLength").value);
    let toLength = parseInt(document.querySelector("#toLength").value);
    let filterBy = document.querySelector("#win-or-lose-option").value;
    let continuesBy = document.querySelector("#continue-times-option").value;
    let continueTimes = parseInt(document.querySelector("#continue-times").value);
    return calculate(inputString, fromLength, toLength, filterBy, continuesBy, continueTimes);
}

function calculate(inputString, fromLength, toLength, filterBy, continuesBy, continueTimes) {
    // Split string
    let arr = [];
    for (let strLength = fromLength; strLength <= toLength; strLength++){
        for (let i = 0; i <= inputString.length - strLength; i++) {
          let str = inputString.substring(i, i + strLength);
            if (!checkInclude(arr, str))
                arr.push(new GameItem(str));
        }
    }
    // console.log(arr);
    // let output = runAndFilter(inputString, arr, filterBy, continuesBy, continueTimes);
    // console.log(output);

    // let maxValueWin = 0;
    // let maxValueLost = 0;
    // let str = "";
    // copiedData = "";
    // if (output.length > 0) {
    //     arr.forEach((item, index) => {
    //         str += `<tr>
    //             <th scope="row">${index + 1}</th>
    //             <td>${item.base}-${item.dectect}</td>
    //             <td>${item.maxContinuesWin}</td>
    //             <td>${item.maxContinuesLost}</td>
                // <td>${item.winNum}</td>
                // <td>${item.lostNum}</td>
    //         </tr>`;
    //         copiedData += `${item.base}-${item.dectect}\n`;
    //     })
    //     maxValueWin = arr[0].maxContinuesWin;
    //     maxValueLost = arr[0].maxContinuesLost;
    //     arr.forEach(elm => {
    //         if (elm.maxContinuesWin > maxValueWin)
    //             maxValueWin = elm.maxContinuesWin;
    //         if (elm.maxContinuesLost > maxValueLost)
    //             maxValueLost = elm.maxContinuesLost
    //     })
    // }
    // let table = document.querySelector("#table-result-body");
    // table.innerHTML = str;
    // let maxValueWinElm = document.querySelector("#max-win-lien-tiep");
    // let maxValueLostElm = document.querySelector("#max-lose-lien-tiep");
    // let dataTextResultElm = document.querySelector("#data-text-result");
    // maxValueWinElm.innerText = maxValueWin;
    // maxValueLostElm.innerText = maxValueLost;
    // // var newline = String.fromCharCode(13, 10);
    // dataTextResultElm.innerHTML = copiedData.replace("\\n", '<br>');
    return arr;
}

function clickToCopy() {
    // console.log(copiedData);
    navigator.clipboard.writeText(copiedData);
}


function runAndFilter(inputString, arr, typeWinOrLose, typeContinue, continueTimes) {
    calculateInternal(inputString, arr);
    // Select by pointer
    let myFunction;
    if (typeWinOrLose === all)
        myFunction = allFunc
    if (typeWinOrLose === both)
        myFunction = bothFunc
    if (typeWinOrLose === neither)
        myFunction = neitherFunc;
    if (typeWinOrLose === justWin)
        myFunction = justWinFunc
    if (typeWinOrLose === justLose)
        myFunction = justLoseFunc
    if (typeWinOrLose === bothNotContinues)
        myFunction = bothNotContinuesFunc
    if (typeWinOrLose === justLoseNotContinues)
        myFunction = justLoseNotContinuesFunc
    if (typeWinOrLose === justWinNotContinues)
        myFunction = justWinNotContinuesFunc
    
    let myExtraFunction;
    if (typeContinue === smallerThan)
        myExtraFunction = smallerThanFunc
    if (typeContinue === largerThan)
        myExtraFunction = largerThanFunc
    if (typeContinue === extractNum)
        myExtraFunction = extractNumFunc
    if (typeContinue === ignoreThis) 
        myExtraFunction = ignoreThisFunc;
    
    // Filter function
    let newList = [];
    arr.forEach(elm => {
        if (myFunction(myExtraFunction, elm, continueTimes))
            newList.push(elm);
    })
    return newList;
}

function calculateInternal(inputString, arr) {
    if (arr.length == 0) return null;

    arr.forEach((element, index) => {
        let previousState = noneState;
        let currentState = noneState;
        let winContinue = 0;
        let loseContinue = 0;
        let i = -1;
        while ((i = inputString.indexOf(element.base, i + 1)) != -1) {
            if (i + element.base.length >= inputString.length)
                break;
            if (inputString[i + element.base.length] === element.dectect) {
                // console.log("Win");
                element.winNum++;
                if (currentState === noneState) {
                    currentState = winState;
                    previousState = winState;
                    winContinue++;
                }
                else {
                    currentState = winState;
                    // if (index === arr.length - 1)
                    //   console.log(`${currentState} vs ${previousState}`);
                    if (currentState === previousState)
                        winContinue++;
                    else
                        winContinue = 1;
                    previousState = currentState;
                }
            }
            else {
                // console.log("Lost");
                element.lostNum++;
                if (currentState === noneState) {
                    currentState = loseState;
                    previousState = loseState;
                    loseContinue++;
                }
                else {
                    currentState = loseState;
                    //  if (index === arr.length - 1)
                    //    console.log(`${currentState} vs ${previousState}`);
                    if (currentState === previousState)
                        loseContinue++;
                    else
                        loseContinue = 1;
                    previousState = currentState;
                }
            }
            // Update max value
            if (winContinue > element.maxContinuesWin)
                element.maxContinuesWin = winContinue;
            if (loseContinue > element.maxContinuesLost)
                element.maxContinuesLost = loseContinue;
        }
    });
    return arr;
}


let wMax = 0;
let lMax = 0;
// function checking(inputString, arr, minNum=2) {
//     for (let i = minNum-1; i <= inputString; i++){
//         let sub = inputString.substring(0, i);
        
//     }
// }

function recursionChecking(inputString, arr, indexNum, previousState, wCount = 0, lCount = 0) {
    if (wCount > wMax) {
        wMax = wCount;
        console.log("Win max update: " + wMax);
    }
    if (lCount > lMax) {
        lMax = lCount;
        console.log("Lose max update: " + lMax);
    }
    console.log(indexNum);
    if (indexNum > inputString.length) return null;
    let start = indexNum - 14;
    let sub;
    if (start >= 0)
        sub = inputString.substring(start, indexNum - 1);
    else sub = inputString.substring(0, indexNum - 1);
    let count = 0;
    let item;
    for (let i = 0; i < arr.length; i++) {
        if (isValid(sub, arr[i].base)) {
            item = arr[i];
            count++;
            // console.log(sub + " " + arr[i].base);
            // if (inputString[indexNum + 1] === arr[i].dectect) {
            //     if (previousState === noneState)
            //         wCount++;
            //     else {
            //         if (previousState === winState)
            //             wCount++;
            //         else 
            //             wCount = 1;
            //     }
            //     return recursionChecking(inputString, arr, indexNum + 1, winState, wCount, lCount);
            // } else {
            //     if (previousState === noneState)
            //         lCount++;
            //     else {
            //         if (previousState === loseState)
            //             lCount++;
            //         else
            //             lCount = 1;
            //     }
            //     return recursionChecking(inputString, arr, indexNum + 1, loseState, wCount, lCount);
            // }
        }
            
    }
    if (count == 1) {
        console.log(sub + " " + item.base);
        if (inputString[indexNum + 1] === item.dectect) {
            if (previousState === noneState)
                wCount++;
            else {
                if (previousState === winState)
                    wCount++;
                else 
                    wCount = 1;
            }
            return recursionChecking(inputString, arr, indexNum + 1, winState, wCount, lCount);
        } else {
            if (previousState === noneState)
                lCount++;
            else {
                if (previousState === loseState)
                    lCount++;
                else
                    lCount = 1;
            }
            return recursionChecking(inputString, arr, indexNum + 1, loseState, wCount, lCount);
        }
    }   
    return recursionChecking(inputString, arr, indexNum + 1, noneState, wCount, lCount);
}

function linearChecking(inputString, arr, fromLength, toLength) {
    toLength = toLength - 1;
    let previousState = noneState;
    let currentState = noneState;
    let winContinue = 0;
    let loseContinue = 0;
    for (let i = fromLength - 1; i < inputString.length; i++){
        console.log("Index: " + i);
        let sub;
        if (i - toLength >= 0)
            sub = inputString.substring(i - toLength, i);
        else
            sub = inputString.substring(0, i);
        let countOne = 0;
        let item;
        for (let index = 0; index < arr.length; index++){
            if (isValid(sub, arr[index].base)) {
                countOne++;
                item = arr[index];
            }
        }
        // console.log(`${sub}: count(${countOne})`)
        if (countOne >1 || countOne == 0 || i >= inputString.length)
            continue;
        console.log(`${sub} - ${item.str}`)
        console.log(`Compare: ${inputString[i]} - ${item.dectect}`);
        if (inputString[i] === item.dectect) {
            console.log("Win");
            item.winNum++;
            if (currentState === noneState) {
                currentState = winState;
                previousState = winState;
                winContinue++;
            } else {
                currentState = winState;
                // if (index === arr.length - 1)
                //   console.log(`${currentState} vs ${previousState}`);
                if (currentState === previousState) winContinue++;
                else winContinue = 1;
                previousState = currentState;
            }
            } else {
            console.log("Lost");
            item.lostNum++;
            if (currentState === noneState) {
                currentState = loseState;
                previousState = loseState;
                loseContinue++;
            } else {
                currentState = loseState;
                //  if (index === arr.length - 1)
                //    console.log(`${currentState} vs ${previousState}`);
                if (currentState === previousState) loseContinue++;
                else loseContinue = 1;
                previousState = currentState;
            }
        }
        // Update max value
        if (winContinue > wMax)
          wMax = winContinue;
        if (loseContinue > lMax)
          lMax = loseContinue;
    }
    console.log(wMax + " - " + lMax);
}

// function checkAndAdd(inputString, arr, targetLose, targetWin) {
//     let myList = [];
//     arr.forEach(item => {
        
//     })
// }

function isValid(baseString, base) {
    // console.log(`${baseString} and ${base}`)
    if (baseString.length < base.length)
        return false;
    let subBaseString = baseString.substring(baseString.length - base.length, baseString.length);
    if (subBaseString === base)
        return true;
    return false;
}

// Check string include in array
function checkInclude(arr, str) {
    let compareStr = str.substring(0, str.length -1)
    for (let i = 0; i < arr.length; i++){
        // Old version
        // if (arr[i].str === str)
        //     return true;
        if (arr[i].base === compareStr)
            return true;
    }
    return false;
}

let inputString =
  "XTXXTTTTXTXXTTXTXTTTTXTTXTTTTTXXXXTTXXTTXTTTTXTTXTXTTXTXTTXTTTTTXTTXXXTXXXTTXTXTTTTXTXTTXTXTXTTTTXTXTTTXTXTTTXTTTTXXXXTTTTTTTTXXXTXTXTTXTXTXTTTXTTTXXXTTXTTXTTXTTXTXTTXTTXTXTXTTXTXTTTTTXTXTTXTXTXTTTTXTXTXTTXTXTTXTXTTXTXTXTTXTXTTXTXTXTTTTXTXTTXTXTTXTXTTXTXTXTTXTTTTXTTXTXTTXTXTTXTXTXTXTTXTXTTXTTXTTTXTXTXTXTXTTTXXTTXXTXTTXXTTTXXTTXTXXXTXTXTTXTXTXTXTXTXTTTXTTXTTXTTXTXTTTTTXTXXTXTTTXTTXTTTXTTXTTXXTXTTXTXTTXTXTTXTTTTXTTTXTTXTTTTXTXTTXXTTTXTXTTXTTTXTTXTTXTTXTXXXTXTXTXTTXTXTXTXTXTXTXTTTTXTTTXTTXXTXTTXTXT";
let myArr = calculate(
    inputString, 5, 13, "1", "1", 5,
);

myArr.forEach(item => {
    console.log(`${item.base}-${item.dectect}`)
})

// let myArr = [
//     new GameItem('XT'),
//     new GameItem('TXX'),
//     new GameItem('TTXT'),
//     new GameItem('TTTXX')
// ]
// recursionChecking(inputString, myArr, 5, noneState, 0, 0);
// linearChecking(inputString, myArr, 5, 13);
// console.log("Hello");
// console.log("Win max: "+ wMax);
// console.log("Lost max: " + lMax);