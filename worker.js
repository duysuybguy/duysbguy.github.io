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

    reset() {
        this.winNum = 0,
        this.lostNum = 0,
        this.maxContinuesWin = 0,
        this.maxContinuesLost = 0;
    }

    isIncludeOrChild(another) {
        if (another.base.length > this.base.length) {
            return another.isInclude(this);
        }
        if (another.base.length === this.base.length) {
            if (another.base === this.base)
                return true;
            return false;
        }
        if (another.base.length < this.base.length) {
            return this.isInclude(another);
        }
    }

    isInclude(another) {
        let minimizeSizeStr = this.base.substring(this.base.length - another.base.length, this.base.length)
        if (minimizeSizeStr === another.base)
            return true;
        return false;
    }

    isEqual(another) {
        if (this.base === another.base)
            return true;
        return false;
    }
}

let winState = 1;
let loseState = -1;
let noneState = 0;


self.onmessage = function (message) {
    // assign variable
    let data = message.data;
    // console.log(data)
    if (data !== '') {
        let { inputString, checkString, fromLength, toLength, filterBy, continuesBy, continueTimesWin, continueTimesLose } = data;
        // Do work
        let arr = splitIntoArray(inputString, fromLength, toLength, continueTimesWin, continueTimesLose);
        let [wMaxPre, lMaxPre] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
        let [wMax, lMax] = calculateWinLoseRate(checkString, arr, fromLength, toLength)
        arr.forEach((elm) => calculateInternal(checkString, elm));
        let output = arr.sort((a, b) => a.str.length - b.str.length);
        this.postMessage({
            arr: output,
            wMax: wMax,
            lMax: lMax,
            wMaxPre: wMaxPre,
            lMaxPre: lMaxPre
        })
    }
   
}

function splitIntoArray(inputString, fromLength, toLength, continueTimesWin = 5, continueTimesLose = 5) {
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

                    // let [wMax, lMax] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
                    // let temp = arr[index];
                    // arr.splice(index, 1, gameObj);
                    // let [wMax2, lMax2] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
                    // // let minL = Math.min(lMax2, lMax);
                    // if (lMax2 > lMax && wMax2 > wMax) {
                    //     arr.splice(index, 1, temp);
                    // } else {
                    //     if (lMax2 > lMax || wMax2 > wMax) {
                    //         arr.splice(index, 1, temp);
                    //     }
                    // }
                    isNone = false;
                }
            }
            if (isNone) {
                arr.push(gameObj);
                [insideW, insideL] = calculateWinLoseRate(inputString, arr, fromLength, toLength);
                if (insideL <= outsideL && insideW <= outsideW) {
                    if (insideL >= continueTimesLose || insideW >= continueTimesWin)
                        arr.pop();
                }
                else {
                    if (insideL > outsideL || insideW > outsideW)
                        if (insideL >= continueTimesLose || insideW >= continueTimesWin) arr.pop();
                }
            }
        }
    }
    return arr;
}

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
		let dectectItem = "T";

		for (let index = 0; index < arr.length; index++) {
			if (isValid(sub, arr[index].base)) {
				if (arr[index].dectect === "T") countT++;
				if (arr[index].dectect === "X") countX++;
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
		if (countT === countX) continue;

		if (countX > countT) dectectItem = "X";

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

function calculateInternal(inputString, element) {
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
}

function isValid(baseString, base) {
    if (baseString.length < base.length)
        return false;
    let subBaseString = baseString.substring(baseString.length - base.length, baseString.length);
    if (subBaseString === base) {
        return true;
    }
    return false;
}
