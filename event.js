let inputElemt = document.querySelector("#input-text");
let textNumber = document.querySelector("#number-of-input-length");
inputElemt.addEventListener("input", function () {
    textNumber.innerHTML = inputElemt.value.length;
});

let inputElemt2 = document.querySelector("#input-text-2");
let textNumber2 = document.querySelector("#number-of-input-test-length");
inputElemt2.addEventListener("input", function () {
    textNumber2.innerHTML = inputElemt2.value.length;
});

let loadingSpiner = document.querySelector("#loading-spiner");

async function clickHandle(thisButton) {
    thisButton.disabled = true;
    // loadingSpiner.classList.remove('hide');
    const promiseA = new Promise(getDataAndRun);
    thisButton.disabled = false;
    // loadingSpiner.classList.add("hide");
}

// let arr = ['X', 'T'];
// let str = '';
// for (let i = 0; i < 500; i++){
//     str += arr[Math.floor(Math.random() * 2)]
// }
// console.log(str);