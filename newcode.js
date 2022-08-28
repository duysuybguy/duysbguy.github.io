// class GameItem{
//     constructor(str, winNum = 0, lostNum = 0, maxContinuesWin = 0, maxContinuesLost = 0) {
//         this.str = str;
//         if (str.length >= 2) {
//             this.base = str.substring(0, str.length - 1);
//             this.dectect = str[str.length - 1];
//         } else {
//             throw Error("Chuỗi không đủ độ dài!");
//         }
//         this.winNum = winNum;
//         this.lostNum = lostNum;
//         this.maxContinuesWin = maxContinuesWin;
//         this.maxContinuesLost = maxContinuesLost;
//     }

//     reset() {
//         this.winNum = 0,
//         this.lostNum = 0,
//         this.maxContinuesWin = 0,
//         this.maxContinuesLost = 0;
//     }

//     isIncludeOrChild(another) {
//         if (another.base.length > this.base.length) {
//             return another.isInclude(this);
//         }
//         if (another.base.length === this.base.length) {
//             if (another.base === this.base)
//                 return true;
//             return false;
//         }
//         if (another.base.length < this.base.length) {
//             return this.isInclude(another);
//         }
//     }

//     isInclude(another) {
//         let minimizeSizeStr = this.base.substring(this.base.length - another.base.length, this.base.length)
//         if (minimizeSizeStr === another.base)
//             return true;
//         return false;
//     }
// }

// Continues by value 
// let smallerThan = "1";
// let largerThan = "2";
// let extractNum = "3";
// let ignoreThis = "4";

// const smallerThanFunc = (num, compareTo) => {
//     return num <= compareTo;
// }

// const largerThanFunc = (num, compareTo) => {
//     return num >= compareTo;
// }

// const extractNumFunc = (num, compareTo) => {
//     return num == compareTo;
// }

// const ignoreThisFunc = (num, compareTo) => {
//     return true;
// }

// // Filter by value
// let all = "0";
// let both = "1";
// let justWin = "2";
// let justLose = "3";
// let bothNotContinues = "4"
// let justWinNotContinues = "5";
// let justLoseNotContinues = "6";
// let neither = "7";

// const allFunc = (func, item, num) => {
//     if (func(item.maxContinuesWin, num) || func(item.maxContinuesLost, num) || func(item.winNum, num) || func(item.lostNum, num))
//         return true;
//     return false;
// }

// const bothFunc = (func, item, num) => {
//     if (func(item.maxContinuesWin, num) && func(item.maxContinuesLost, num)) 
//         return true;
//     return false;
// }

// const justWinFunc = (func, item, num) => {
//     if (func(item.maxContinuesWin, num))
//         return true;
//     return false;
// };

// const justLoseFunc = (func, item, num) => {
//     if (func(item.maxContinuesLost, num))
//         return true;
//     return false;
// }

// const bothNotContinuesFunc = (func, item, num) => {
//     if (func(item.winNum, num) || func(item.lostNum, num))
//         return true;
//     return false;
// }

// const justWinNotContinuesFunc = (func, item, num) => {
//     if (func(item.winNum, num))
//         return true;
//     return false;
// }

// const justLoseNotContinuesFunc = (func, item, num) => {
//     if (func(item.lostNum, num))
//         return true;
//     return false;
// }

// const neitherFunc = (func, item, num) => {
//     if (func(item.maxContinuesWin, num) || func(item.maxContinuesLost, num))
//         return true;
//     return false;
// }

// Game state
// let winState = 1;
// let loseState = -1;
// let noneState = 0;
let copiedData = "";

if (!window.Worker) {
    alert("Trình duyệt không hỗ trợ chạy chương trình này (WebWorker not found)");
    location.href = "https://caniuse.com/webworkers";
}

let worker = new Worker('./worker.js')
const audio = new Audio("./sound.wav");

//Get values
function getDataAndRun_Old() {
    let inputString = document.querySelector("#input-text").value;
    let checkString = document.querySelector("#input-text-2").value;
    let fromLength = parseInt(document.querySelector("#fromLength").value);
    let toLength = parseInt(document.querySelector("#toLength").value);
    let filterBy = document.querySelector("#win-or-lose-option").value;
    let continuesBy = document.querySelector("#continue-times-option").value;
    let continueTimes = parseInt(document.querySelector("#continue-times").value);

    let arr = splitIntoArray(inputString, fromLength, toLength, continueTimes);
    let [wMaxPre, lMaxPre] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
    let [wMax, lMax] = calculateWinLoseRate(checkString, arr, fromLength, toLength);
    arr.forEach((elm) => calculateInternal(checkString, elm));
    // console.log(`${wMax} - ${lMax}`);
    // console.log(checkString)
    exportData(arr, wMax, lMax, wMaxPre, lMaxPre);
}

let timeCounter = 0;
let timeInterval = null;
function countTime() {
    timeCounter = 0;
    timeInterval = setInterval(() => {
      timeCounter++;
      $("#timer-counter").text(`(${timeCounter} s)`);
    }, 1000);
}

function stopCountTime() {
    clearInterval(timeInterval);
    $("#timer-counter").text("");
}

function getDataAndRun() {
    $("#mymodal").modal("show");
    countTime();
    let inputString = document.querySelector("#input-text").value;
    let checkString = document.querySelector("#input-text-2").value;
    let fromLength = parseInt(document.querySelector("#fromLength").value);
    let toLength = parseInt(document.querySelector("#toLength").value);
    let filterBy = document.querySelector("#win-or-lose-option").value;
    let continuesBy = document.querySelector("#continue-times-option").value;
    let continueTimes = parseInt(document.querySelector("#continue-times").value);
    worker.postMessage({
        inputString: inputString,
        checkString: checkString,
        fromLength: fromLength,
        toLength: toLength,
        filterBy: filterBy,
        continuesBy: continuesBy,
        continueTimes: continueTimes,
    })
    // Add loading effect
}

worker.onmessage = function (message) {
    let data = message.data;
    // console.log(data);
    let { arr, wMax, lMax, wMaxPre, lMaxPre } = data;
    exportData(arr, wMax, lMax, wMaxPre, lMaxPre);
    stopCountTime();
    $("#mymodal").modal("hide");
    $("#result-time-counter").text(`(Time: ${timeCounter}s)`);
    if ($("#customSwitch1").is(":checked"))
        audio.play();
    // Remove loading effect
};

function stopAction() {
    stopCountTime();
    $("#result-time-counter").text('');
    worker.terminate();
    window.location.reload();
}

function exportData(output, maxValueWin=0, maxValueLost=0, wMaxPre=0, lMaxPre=0) {
    let str = "";
    copiedData = "";
    if (output.length > 0) {
      output.forEach((item, index) => {
        str += `<tr>
                <th scope="row">${index + 1}</th>
                <td>${item.base}-${item.dectect}</td>
                <td>${item.maxContinuesWin}</td>
                <td>${item.maxContinuesLost}</td>
                <td>${item.winNum}</td>
                <td>${item.lostNum}</td>
            </tr>`;
        copiedData += `${item.base}-${item.dectect}\n`;
      });
    //   maxValueWin = output[0].maxContinuesWin;
    //   maxValueLost = output[0].maxContinuesLost;
    //   output.forEach((elm) => {
    //     if (elm.maxContinuesWin > maxValueWin)
    //       maxValueWin = elm.maxContinuesWin;
    //     if (elm.maxContinuesLost > maxValueLost)
    //       maxValueLost = elm.maxContinuesLost;
    //   });
    }
    let table = document.querySelector("#table-result-body");
    table.innerHTML = str;
    let maxValueWinElm = document.querySelector("#max-win-lien-tiep");
    let maxValueLostElm = document.querySelector("#max-lose-lien-tiep");
    let dataTextResultElm = document.querySelector("#data-text-result");

    let maxWinPre = document.querySelector("#max-win-lien-tiep-previous");
    let maxLosePre = document.querySelector("#max-lose-lien-tiep-previous");
    maxWinPre.innerText = wMaxPre;
    maxLosePre.innerText = lMaxPre;

    let maxWinNext = document.querySelector("#max-win-lien-tiep-next");
    let maxLoseNext = document.querySelector("#max-lose-lien-tiep-next");

    maxValueWinElm.innerText = maxValueWin;
    maxValueLostElm.innerText = maxValueLost;

    maxWinNext.innerText = maxValueWin;
    maxLoseNext.innerText = maxValueLost;
    // var newline = String.fromCharCode(13, 10);
    dataTextResultElm.innerHTML = copiedData.replace("\\n", "<br>");
}

// Select what function will run
function selectFunction(inputString, arr, typeWinOrLose, typeContinue) {
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
    // let newList = [];
    // arr.forEach(elm => {
    //     if (myFunction(myExtraFunction, elm, continueTimes))
    //         newList.push(elm);
    // })
    // return newList;
}

function splitIntoArray(inputString, fromLength, toLength, continueTimes = 5) {
    let arr = [];
    for (let strLength = fromLength; strLength <= toLength; strLength++){
        for (let i = 0; i <= inputString.length - strLength; i++) {
            let str = inputString.substring(i, i + strLength);
            // if (!checkInclude(arr, str))
            //     arr.push(new GameItem(str));
            let gameObj = new GameItem(str);
            // calculateInternal(inputString, gameObj);
            let isNone = true;
            let [outsideW, outsideL] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
            let insideW, insideL;
            for (let index = 0; index < arr.length; index++){
                // console.log(`${gameObj.str} ---- ${arr[index].str}`)
                if (gameObj.isEqual(arr[index])) {
                    // arr.push(gameObj);
                    // console.log("Hello")

                    let [wMax, lMax] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
                    let temp = arr[index];
                    arr.splice(index, 1, gameObj);
                    let [wMax2, lMax2] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
                    // let minL = Math.min(lMax2, lMax);
                    if (lMax2 > lMax && wMax2 > wMax) {
                        arr.splice(index, 1, temp);
                    } else {
                        if (lMax2 > lMax || wMax2 > wMax) {
                            arr.splice(index, 1, temp);
                        }
                    }
                    isNone = false;
                }
            }
            if (isNone) {
                arr.push(gameObj);
                [insideW, insideL] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
                if (insideL <= outsideL && insideW <= outsideW) {
                    if (insideL >= continueTimes || insideW >= continueTimes)
                        arr.pop();
                }
                else {
                    if (insideL > outsideL || insideW > outsideW)
                        if (insideL >= continueTimes || insideW >= continueTimes)
                            arr.pop();
                }
            }
        }
    }
    return arr;
}

// function calculateWinLoseRate(inputString, arr, fromLength, toLength, isLogger = false) {
//     toLength = toLength - 1;
//     let lMax = 0;
//     let wMax = 0;
//     let previousState = noneState;
//     let currentState = noneState;
//     let winContinue = 0;
//     let loseContinue = 0;
//     for (let i = fromLength - 1; i < inputString.length; i++){
//         // console.log("Index: " + i);
//         let sub;
//         if (i - toLength >= 0)
//             sub = inputString.substring(i - toLength, i);
//         else
//             sub = inputString.substring(0, i);
//         let item;
//         let countX = 0;
//         let countT = 0;
//         for (let index = 0; index < arr.length; index++){
//             if (isValid(sub, arr[index].base)) {
//                 countOne++;
//                 item = arr[index];
//             }
//         }
//         if (isLogger) {
//             console.log(`${sub}`)
//         }
//         // console.log(`${sub}: count(${countOne})`)
//         if (countOne > 1 || countOne == 0 || i >= inputString.length) {
//             if (isLogger && countOne > 1)
//                 console.log('Count different')
//             continue;
//         }
        
//         if (isLogger) {
//             console.log(`${sub} - ${item.str}`)
//             console.log(`Compare: ${inputString[i]} - ${item.dectect}`);
//         }

//         if (inputString[i] === item.dectect) {
//             // console.log("Win");
//             // item.winNum++;
//             if (currentState === noneState) {
//                 currentState = winState;
//                 previousState = winState;
//                 winContinue++;
//             } else {
//                 currentState = winState;
//                 // if (index === arr.length - 1)
//                 //   console.log(`${currentState} vs ${previousState}`);
//                 if (currentState === previousState) winContinue++;
//                 else winContinue = 1;
//                 previousState = currentState;
//             }
//             } else {
//             // console.log("Lost");
//             // item.lostNum++;
//             if (currentState === noneState) {
//                 currentState = loseState;
//                 previousState = loseState;
//                 loseContinue++;
//             } else {
//                 currentState = loseState;
//                 //  if (index === arr.length - 1)
//                 //    console.log(`${currentState} vs ${previousState}`);
//                 if (currentState === previousState) loseContinue++;
//                 else loseContinue = 1;
//                 previousState = currentState;
//             }
//         }
//         if (isLogger) {
//             console.log(`${winContinue} - ${loseContinue}`)
//         }
//         // Update max value
//         if (winContinue > wMax)
//             wMax = winContinue;
//         if (loseContinue > lMax)
//             lMax = loseContinue;
//     }
//     // console.log(`${wMax} - ${lMax}`);
//     return [wMax, lMax]
// }

// function calculateWinLoseRateElm(inputString, item, fromLength, toLength) {
//     toLength = toLength - 1;
//     let lMax = 0;
//     let wMax = 0;
//     let previousState = noneState;
//     let currentState = noneState;
//     let winContinue = 0;
//     let loseContinue = 0;
//     for (let i = fromLength - 1; i < inputString.length; i++){
//         // console.log("Index: " + i);
//         let sub;
//         if (i - toLength >= 0)
//             sub = inputString.substring(i - toLength, i);
//         else
//             sub = inputString.substring(0, i);
//         // for (let index = 0; index < arr.length; index++){
//         //     if (isValid(sub, arr[index].base)) {
//         //         countOne++;
//         //         item = arr[index];
//         //     }
//         // }
//         // console.log(`${sub}: count(${countOne})`)
//         // if (countOne >1 || countOne == 0 || i >= inputString.length)
//         //     continue;
//         // console.log(`${sub} - ${item.str}`)
//         // console.log(`Compare: ${inputString[i]} - ${item.dectect}`);
//         if (inputString[i] === item.dectect) {
//             // console.log("Win");
//             item.winNum++;
//             if (currentState === noneState) {
//                 currentState = winState;
//                 previousState = winState;
//                 winContinue++;
//             } else {
//                 currentState = winState;
//                 // if (index === arr.length - 1)
//                 //   console.log(`${currentState} vs ${previousState}`);
//                 if (currentState === previousState) winContinue++;
//                 else winContinue = 1;
//                 previousState = currentState;
//             }
//             } else {
//             // console.log("Lost");
//             item.lostNum++;
//             if (currentState === noneState) {
//                 currentState = loseState;
//                 previousState = loseState;
//                 loseContinue++;
//             } else {
//                 currentState = loseState;
//                 //  if (index === arr.length - 1)
//                 //    console.log(`${currentState} vs ${previousState}`);
//                 if (currentState === previousState) loseContinue++;
//                 else loseContinue = 1;
//                 previousState = currentState;
//             }
//         }
//         // Update max value
//         if (winContinue > wMax)
//             wMax = winContinue;
//         if (loseContinue > lMax)
//             lMax = loseContinue;
//     }
//     // console.log(`${wMax} - ${lMax}`);
//     return [wMax, lMax];
// }


function calculateWinLoseRate(inputString, arr, fromLength, toLength, isLogger = false) {
	toLength = toLength - 1;
	let lMax = 0;
	let wMax = 0;
	let previousState = noneState;
	let currentState = noneState;
	let winContinue = 0;
	let loseContinue = 0;
	for (let i = fromLength - 1; i < inputString.length; i++) {
		// console.log("Index: " + i);
		let sub;
		if (i - toLength >= 0) sub = inputString.substring(i - toLength, i);
		else sub = inputString.substring(0, i);        
        let countT = 0;
        let countX = 0;
        let dectectItem = 'T';
        
		for (let index = 0; index < arr.length; index++) {
			if (isValid(sub, arr[index].base)) {
				// countOne++;
				// item = arr[index];
                if (arr[index].dectect === 'T')
                    countT++;
                if (arr[index.dectect] === 'X')
                    countX++;
			}
        }
        
		if (isLogger) {
			console.log(`${sub}`);
		}
		// console.log(`${sub}: count(${countOne})`)
		// if (countOne > 1 || countOne == 0 || i >= inputString.length) {
		// 	if (isLogger && countOne > 1) console.log("Count different");
		// 	continue;
		// }
        if (countT === countX)
            continue;
        
        if (countX > countT)
            dectectItem = 'X'

		// if (isLogger) {
		// 	console.log(`${sub} - ${item.str}`);
		// 	console.log(`Compare: ${inputString[i]} - ${item.dectect}`);
		// }

		if (inputString[i] === dectectItem) {
			// console.log("Win");
			// item.winNum++;
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
			// console.log("Lost");
			// item.lostNum++;
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
		if (isLogger) {
			console.log(`${winContinue} - ${loseContinue}`);
		}
		// Update max value
		if (winContinue > wMax) wMax = winContinue;
		if (loseContinue > lMax) lMax = loseContinue;
	}
	// console.log(`${wMax} - ${lMax}`);
	return [wMax, lMax];
}

// function checkInclude(arr, str) {
//     let compareStr = str.substring(0, str.length -1)
//     for (let i = 0; i < arr.length; i++){
//         // Old version
//         // if (arr[i].str === str)
//         //     return true;
//         if (arr[i].base === compareStr)
//             return true;
//     }
//     return false;
// }

function isValid(baseString, base) {
    if (baseString.length < base.length)
        return false;
    let subBaseString = baseString.substring(baseString.length - base.length, baseString.length);
    if (subBaseString === base) {
        return true;
    }
    return false;
}

// let inputString =
//   "XTXTTTXTTTXTTTTXTXXTTTXXTTXTXTXTXTTTXXTXXTXTXXTTXTXXTTTTXXTTTXXTTXXTTTTXTTXTTXTTTTTXTTXTXXXXTTTTTTTTTTTTXTXTXTXTXXTTXXXXXXXXXTXXXXXTXTTXTTTTTTTXXXXTTTXTTXXTXTTTXTXTXXTXXXXTXXTTXTXTXXTTXXXTXXTXTTTTTXTTTXXTXTXXXTTXXTTXXTXXTTTTTTXXXTXXTTXTTXXXXXXXXTTXTT";
// let arr = splitIntoArray(inputString, 5, 13);
// let [wMax, lMax] = calculateWinLoseRate(inputString, arr, 5, 13);
// arr.forEach((item, index) => {
//     console.log(`${item.base}-${item.dectect}`)
//     // for (let i = index + 1;i<)
// })
// for (let i = 0; i < arr.length - 1; i++){
//     for (let j = i + 1; j < arr.length; j++){
//         if (arr[i].isIncludeOrChild(arr[j]))
//             console.log(`${arr[i].str} - ${arr[j].str}`);
//     }
// }
// console.log(`${wMax} - ${lMax}`);

function clickToCopy(obj) {
    // console.log(copiedData);
    navigator.clipboard.writeText(copiedData);
}

// let gm = new GameItem("XXXTT");
// let gm2 = new GameItem("TXXTTT");
// console.log(gm2.isIncludeOrChild(gm))