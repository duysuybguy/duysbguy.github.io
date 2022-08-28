class GameItem {
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
		// this.appearance = new Set();
		this.isCalculateInternal = false;
	}

	reset() {
		this.calculateInternal = false;
		(this.winNum = 0), (this.lostNum = 0), (this.maxContinuesWin = 0), (this.maxContinuesLost = 0);
	}

	isIncludeOrChild(another) {
		if (another.base.length > this.base.length) {
			return another.isInclude(this);
		}
		if (another.base.length === this.base.length) {
			if (another.base === this.base) return true;
			return false;
		}
		if (another.base.length < this.base.length) {
			return this.isInclude(another);
		}
	}

	isInclude(another) {
		let minimizeSizeStr = this.base.substring(this.base.length - another.base.length, this.base.length);
		if (minimizeSizeStr === another.base) return true;
		return false;
	}

	calculateInternal(inputString) {
		this.calculateInternal = true;
		let previousState = noneState;
		let currentState = noneState;
		let winContinue = 0;
		let loseContinue = 0;
		let i = -1;
		while ((i = inputString.indexOf(this.base, i + 1)) != -1) {
			if (i + this.base.length >= inputString.length) break;
			if (inputString[i + this.base.length] === this.dectect) {
				// console.log("Win");
				this.winNum++;
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
				this.lostNum++;
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
			if (winContinue > this.maxContinuesWin) this.maxContinuesWin = winContinue;
			if (loseContinue > this.maxContinuesLost) this.maxContinuesLost = loseContinue;
		}
	}

	isValid(baseString) {
		let base = this.base;
		if (baseString.length < base.length) return false;
		let subBaseString = baseString.substring(baseString.length - base.length, baseString.length);
		if (subBaseString === base) {
			return true;
		}
		return false;
	}
}

class ItemAndState {
	constructor(item, state, index) {
		this.item = item;
		this.state = state;
		this.index = index;
	}
}

let winState = 1;
let loseState = -1;
let noneState = 0;

class ListControl {
	constructor(inputString, checkString, fromLength, toLength, continueTimes) {
		this.listItem = [];
		this.listAppearance = new Array(inputString.length).fill(new ItemAndState(null, noneState));
		this.inputString = inputString;
		this.checkString = checkString;
		this.fromLength = fromLength;
		this.toLength = toLength;
		this.continueTimes = continueTimes;
	}

	getValidItem(sub) {
		let countOne = 0;
		let item;
		for (let index = 0; index < this.listItem.length; index++) {
			if (this.listItem[index].isValid(sub)) {
				countOne++;
				item = this.listItem[index];
			}
		}
		if (countOne == 1) return item;
		return null;
	}

	getItemAppearance(item) {
		let list = [];
		let len = this.listAppearance.length;
		for (let index = 0; index < len; index++) {
			if (this.listAppearance[index].item === item) list.push(this.listAppearance[index]);
		}
		return list;
	}

	replaceItemAppearance(item, newItem) {
		// let listItem = this.getItemAppearance(item);
		let testList = [];
		let listNewItem = this.markingAppearanceElm(newItem);
		for (let i = 0; i < this.listAppearance.length; i++) {
			let isHas = false;
			for (let j = 0; j < listNewItem.length; j++) {
				if (listNewItem[j].index === i) {
					testList.push(listNewItem[j]);
					isHas = true;
					break;
				}
			}
			if (!isHas)
				if (this.listAppearance[i].item === item) testList.push(new ItemAndState(null, noneState, i));
				else testList.push(this.listAppearance[i]);
		}
		return testList;
	}

    countMaxNearByAppearance(testAppearance) {
        if (this.listItem.length === 0)
            return [0, 0]
		let len = testAppearance.length;
		let maxWin = 0;
		let maxLose = 0;
		let currentWin = 0;
		let currentLose = 0;
		let prevState = noneState;
		let curState = noneState;
		// [1, 0, -1, 0, 1]
		for (let i = 0; i < len; i++) {
			let item = testAppearance[i].state;
			if (item === winState) {
				if (curState === noneState) {
					curState = winState;
					prevState = winState;
					currentWin++;
				} else {
					curState = winState;
					if (curState !== prevState) currentWin = 1;
					else currentWin++;
					prevState = curState;
				}
				// continue;
			}
			if (item === loseState) {
				if (curState === noneState) {
					curState = loseState;
					prevState = loseState;
					currentLose++;
				} else {
					curState = loseState;
					if (curState !== prevState) currentLose = 1;
					else currentLose++;
					prevState = curState;
				}
			}

			if (currentWin > maxWin) maxWin = currentWin;
			if (currentLose > maxLose) maxLose = currentLose;
		}

		return [maxWin, maxLose];
	}

	markingAppearanceElm(element) {
		let i = -1;
		let len = this.inputString.length;
		let listAppearance = [];
		while ((i = this.inputString.indexOf(element.base, i + 1)) != -1) {
			if (i + element.base.length >= len) break;
			if (this.inputString[i + element.base.length] === element.dectect) {
				listAppearance.push(new ItemAndState(element, winState, i + element.base.length));
			} else {
				listAppearance.push(new ItemAndState(element, loseState, i + element.base.length));
			}
		}
		return listAppearance;
	}

	markingAppearance(inputString = this.inputString) {
        let toLength = this.toLength - 1;
        this.listAppearance = new Array(inputString.length).fill(new ItemAndState(null, noneState));
		let len = inputString.length;
		for (let i = this.fromLength - 1; i < len; i++) {
			let sub;
			if (i - toLength >= 0) sub = inputString.substring(i - toLength, i);
			else sub = inputString.substring(0, i);
			let item = this.getValidItem(sub);

            if (item === null) {
                this.listAppearance.splice(i, 1, new ItemAndState(null, noneState, i));
                continue
            }  
			if (inputString[i] === item.dectect) this.listAppearance.splice(i, 1, new ItemAndState(item, winState, i));
			else this.listAppearance.splice(i, 1, new ItemAndState(item, loseState, i));
		}
    }

	splitIntoArray() {
		for (let strLength = this.fromLength; strLength <= this.toLength; strLength++) {
			for (let i = 0; i <= this.inputString.length - strLength; i++) {
				let str = this.inputString.substring(i, i + strLength);
				let gameObj = new GameItem(str);
                let isNone = true;
                this.markingAppearance();
				let [outsideW, outsideL] = this.countMaxNearByAppearance(this.listAppearance);
                let insideW, insideL;
                // console.log('Text: '+gameObj.str);
				for (let index = 0; index < this.listItem.length; index++) {
                    if (gameObj.isIncludeOrChild(this.listItem[index])) {
                        // console.log(`C: ${gameObj.str} - ${this.listItem[index].str}`);
                        this.markingAppearance();
                        let [wMax, lMax] = this.countMaxNearByAppearance(this.listAppearance);
                        let testArr = this.replaceItemAppearance(this.listItem[index], gameObj);
                        let [wMax2, lMax2] = this.countMaxNearByAppearance(testArr);
                        if (lMax > lMax2 && wMax > wMax2) {
                            this.listAppearance = testArr;
                            this.listItem.splice(index, 1, gameObj);
                        }
                        else {
                            if (lMax > lMax2 || wMax > wMax2) {
                                this.listItem.splice(index, 1, gameObj);
                                this.listAppearance = testArr;
                            }
                        }
                        isNone = false;
					}
				}
				if (isNone) {
                    this.listItem.push(gameObj);
                    this.markingAppearance();
                    [insideW, insideL] = this.countMaxNearByAppearance(this.listAppearance);
                    // console.log(`${insideW} - ${insideL}`)
					if (insideL <= outsideL && insideW <= outsideW) {
                        if (insideL >= this.continueTimes || insideW >= this.continueTimes) {
                            this.listItem.pop();
                            // console.log('remove 1');
                        }
                            
					} else {
                        if (insideL > outsideL || insideW > outsideW)
                            if (insideL >= this.continueTimes || insideW >= this.continueTimes) {
                                this.listItem.pop();
                                // console.log('remove 2');
                            }
                                
					}
                }
			}
		}
    }
    
    run() {
        this.splitIntoArray()
        this.listItem.forEach(item => console.log(`${item.base}-${item.dectect}`))
        this.markingAppearance();
        let [maxWPre, maxLPre] = this.countMaxNearByAppearance(this.listAppearance);
        console.log(`${maxWPre} - ${maxLPre}`)
        this.markingAppearance(this.checkString);
        let [maxW, maxL] = this.countMaxNearByAppearance(this.listAppearance);
        console.log(`${maxW} - ${maxL}`)
        this.listItem.forEach(item => item.calculateInternal(this.checkString));
        return [maxW, maxL];
    }
}

let data = {
	inputString:
		"TXXTTXXTXXXTXXXXXXXXTXTTXTXXXXTTXTXXTTXXXTXTTXXTTXXXTXTTXXTXTTXXTTXXTXXTXXXTTTXXTTXXXTTTTTTXTXTXTXTXXTXTXXTXXXTXXXTTXXXXTTTXTTTXXTTXXTXXXTXTXXXTTTXTTXTTXTXTXXTTTXTXTXXTTXTXTTXTTXXTTXXTTTXXTXXTTTXXXXTTXTTXTXXTTTTXTTXTXXXTTTXTTXXXXXTTTTXXXXTTTXXTTTXTXXTXTTXXXXXTTTXTTXTTTTXXTXXTXXTTXXXTTXTXXXTXTTTTTTTXXTXTTXTXXXXTTXTXXXTTXXXXXTXXXXTTXXXTTXTTTXXTTXTTTTTTTTTXXXXXTXTXTXXTTXXXTTXXXTXXTXTTXTXTXTXXTXXTXXXXTTTTTXXTXTXXXXTTTXXTTTXXXTXXTTXTTTTXXTTXXTTXXTTTXXTXXXXXTTXXTXXTTTXTXTTTXXXTXTXXXTXTXTXXXXXTTXTXXXXXXXTTTTTTXTTTTTXXTTXXXXXTTXTXTXTTXTXTXXXTTTTXXTTTTTXXXXXXXXTXXTTXXTXXTXXXTTTTTXXXXXTXTTTTTXXTTXTTTTXTXXTXTTTTXXXTXTTTXTXXXXTTXXTXXXXTTXXTTXXTTXTTXTTXXTTTXTXTXXXTTXTTXXTXTXXXTTTTTXXTXTXTXXTXXTTTTTXTTTTTTXTXXTTTTTXXTTTTXTTXTTXTTXXXXTTTXTTTTTXXTTTXXXXXXXXTTTTTXTTTTTXXTXXXXTTTTXTXXXXTTXXTTTTXXXTXTXXTTXTXTTXXTXXTXTTXXTTXXTXTTXTXXXTTTTTXTXTTTXTXTXXTXTXXXXXXTXTXTTXXXXTTTXTXTXTXTTTXXTXXXXXTTTTTXXXXXTXXXTTXXXXXTXXTTTTXTTTTXTXXXTXXXXTTTXTXXTTXTXXXXXTTTTXTTTXTXTXXXXTXXXXXTXTXXXXXXXXXTTTTXXTTTXTXTXTTTTXTTXXX",
	checkString:
		"TXXTTXXTXXXTXXXXXXXXTXTTXTXXXXTTXTXXTTXXXTXTTXXTTXXXTXTTXXTXTTXXTTXXTXXTXXXTTTXXTTXXXTTTTTTXTXTXTXTXXTXTXXTXXXTXXXTTXXXXTTTXTTTXXTTXXTXXXTXTXXXTTTXTTXTTXTXTXXTTTXTXTXXTTXTXTTXTTXXTTXXTTTXXTXXTTTXXXXTTXTTXTXXTTTTXTTXTXXXTTTXTTXXXXXTTTTXXXXTTTXXTTTXTXXTXTTXXXXXTTTXTTXTTTTXXTXXTXXTTXXXTTXTXXXTXTTTTTTTXXTXTTXTXXXXTTXTXXXTTXXXXXTXXXXTTXXXTTXTTTXXTTXTTTTTTTTTXXXXXTXTXTXXTTXXXTTXXXTXXTXTTXTXTXTXXTXXTXXXXTTTTTXXTXTXXXXTTTXXTTTXXXTXXTTXTTTTXXTTXXTTXXTTTXXTXXXXXTTXXTXXTTTXTXTTTXXXTXTXXXTXTXTXXXXXTTXTXXXXXXXTTTTTTXTTTTTXXTTXXXXXTTXTXTXTTXTXTXXXTTTTXXTTTTTXXXXXXXXTXXTTXXTXXTXXXTTTTTXXXXXTXTTTTTXXTTXTTTTXTXXTXTTTTXXXTXTTTXTXXXXTTXXTXXXXTTXXTTXXTTXTTXTTXXTTTXTXTXXXTTXTTXXTXTXXXTTTTTXXTXTXTXXTXXTTTTTXTTTTTTXTXXTTTTTXXTTTTXTTXTTXTTXXXXTTTXTTTTTXXTTTXXXXXXXXTTTTTXTTTTTXXTXXXXTTTTXTXXXXTTXXTTTTXXXTXTXXTTXTXTTXXTXXTXTTXXTTXXTXTTXTXXXTTTTTXTXTTTXTXTXXTXTXXXXXXTXTXTTXXXXTTTXTXTXTXTTTXXTXXXXXTTTTTXXXXXTXXXTTXXXXXTXXTTTTXTTTTXTXXXTXXXXTTTXTXXTTXTXXXXXTTTTXTTTXTXTXXXXTXXXXXTXTXXXXXXXXXTTTTXXTTTXTXTXTTTTXTTXXX",
	fromLength: 5,
	toLength: 13,
	filterBy: "1",
	continuesBy: "1",
	continueTimes: 5,
};

let control = new ListControl(data.inputString, data.checkString, data.fromLength, data.toLength, data.continueTimes);
let [w, l] = control.run();
// console.log(control.listItem);
