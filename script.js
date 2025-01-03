const arrDiv = document.getElementById("arr");
const numBars = 99;
const animationWait = 500;
const timeouts = [];
const searchingForT = document.getElementById("searchingForT");

let idBar = 0;
let arr = generateArr(numBars);
let mergeWait = animationWait;
let searchingFor = 0;

if (document.getElementById("startSearch") != null)
    document.getElementById("startSearch").onclick = function() {search()};
else
    document.getElementById("startSort").onclick = function() {sort()};

document.getElementById("reset").onclick = function() {reset()};
drawBars(arr);

// User Actions
function search()
{
    reset();

    const alg = document.querySelector('input[name="search"]:checked').value;
    arr = alg === '2' ? generateArrSorted(numBars) : generateArr(numBars);
    for (let i = 0; i < arr.length; i++)
        fixBar(i, arr[i]);

    searchingForNum();
    selectSearch(alg);
}

function sort()
{
    reset();

    const alg = document.querySelector('input[name="sort"]:checked').value;
    arr = generateArr(numBars);
    for (let i = 0; i < arr.length; i++)
        fixBar(i, arr[i]);

    selectSort(alg);
}

function reset()
{
    timeouts.forEach(clearTimeout);
    for (let i = 0; i < numBars; i++)
        clear(i);
    mergeWait = animationWait;
}

function searchingForNum() {
    searchingFor = Math.floor(Math.random() * arr.length) + 1;
    searchingForT.textContent = `Searching For ${searchingFor}`;
}

function selectSearch(alg)
{
    switch (alg)
    {
        case '1':
            linearSearch(arr, searchingFor);
            break;
        case '2':
            binarySearch(arr, searchingFor);
            break;
        default:
            randomSearch(arr, searchingFor);
    }
}

function selectSort(alg)
{
    switch (alg)
    {
        case '1':
            insertionSort(arr);
            break;
        case '2':
            bubbleSort(arr);
            break;
        default:
            mergeSort(arr);
    }
}

// Drawing Bars
function drawBars(arr)
{
    arr.forEach(e => drawBar(e));
}

function drawBar(height)
{
    const bar = document.createElement("div");
    arrDiv.appendChild(bar);
    bar.setAttribute("class", "arrElem");
    bar.setAttribute("id", `bar-${idBar}`);

    const barT = document.createElement("span");
    bar.appendChild(barT);
    barT.setAttribute("id", `bar-text-${idBar}`);

    fixBar(idBar, height);
    idBar++;
}

// Searching Coloring
function searching(j)
{
    const node = document.getElementById(`bar-${j}`)
    clear(j);
    node.classList.add("searching");
}

function searched(j)
{
    const node = document.getElementById(`bar-${j}`);
    clear(j);
    node.classList.add('searched');
}

function clear(j)
{
    const node = document.getElementById(`bar-${j}`);
    node.setAttribute("class", "arrElem");
}

// Sorting Manipulations
function swapBars(i, j)
{
    const bar1 = document.getElementById(`bar-${i}`);
    const barT1 = document.getElementById(`bar-text-${i}`);

    const bar2 = document.getElementById(`bar-${j}`);
    const barT2 = document.getElementById(`bar-text-${j}`);

    [bar1.style.height, bar2.style.height] = [bar2.style.height, bar1.style.height];
    [barT1.textContent, barT2.textContent] = [barT2.textContent, barT1.textContent];
    [barT1.style.left, barT2.style.left] = [barT2.style.left, barT1.style.left];
}

function fixBar(i, height)
{
    const bar = document.getElementById(`bar-${i}`);
    const barT = document.getElementById(`bar-text-${i}`);

    bar.style.height = `${2 * height + 1}px`;
    barT.textContent = `${height}`;
    if(height < 10)
        barT.style.left = '2px';
    else
        barT.style.removeProperty("left");
}

// Generation of Array

function generateArrSorted(size)
{
    const arr = new Array(size);
    for (let i = 0, n = arr.length; i < n; i++)
        arr[i] = i + 1;
    return arr;
}

function generateArr(size)
{
    const arr = generateArrSorted(size);

    // Fisher-Yates Shuffle
    let j;
    for (let i = 0, n = arr.length - 1; i < n; i++)
    {
        j = Math.floor(Math.random() * (n - i + 1)) + i;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Searching Algorithms

function numberFound(j)
{
    searchingForT.textContent = `Target Found at Index ${j}`;
}

function numberNotFound()
{
    searchingForT.textContent = `Target Not Found`;
}

function linearSearch(arr, num)
{
    let timerWait = animationWait;
    for (let i = 0, n = arr.length; i < n; i++)
    {
        timeouts.push(setTimeout(searching, `${timerWait}`, i));
        timerWait += animationWait;
        if (arr[i] === num)
        {
            timeouts.push(setTimeout(numberFound, `${timerWait}`, i));
            return i;
        }

        timeouts.push(setTimeout(searched, `${timerWait}`, i));
    }
    timeouts.push(setTimeout(numberNotFound, `${timerWait}`));
    return NaN;
}

function binarySearch(arr_sorted, num, l=0, r=-1, timerWait=animationWait)
{
    if (r === -1)
        r = arr_sorted.length - 1;

    const mid = Math.floor((r + l) / 2);
    timeouts.push(setTimeout(searching, `${timerWait}`, mid));

    if (arr_sorted[mid] === num)
    {
        timeouts.push(setTimeout(numberFound, `${timerWait}`, mid));
        return mid;
    }
    timeouts.push(setTimeout(searched, `${timerWait + animationWait}`, mid));

    if (num < arr_sorted[mid])
        return binarySearch(arr_sorted, num, l, mid, timerWait=timerWait+animationWait);
    else if (num > arr_sorted[mid])
        return binarySearch(arr_sorted, num, mid + 1, r, timerWait=timerWait+animationWait);

    timeouts.push(setTimeout(numberNotFound, `${timerWait}`));
    return NaN;
}

function randomSearch(arr, num)
{
    let timerWait = animationWait, j = 0;
    for (let cnt = 0, n = 2 * arr.length; cnt < n; cnt++)
    {
        j = Math.floor(Math.random() * arr.length);
        timeouts.push(setTimeout(searching, `${timerWait}`, j));
        timerWait += animationWait;
        if (arr[j] === num)
        {
            timeouts.push(setTimeout(numberFound, `${timerWait}`, j));
            return j;
        }
        timeouts.push(setTimeout(searched, `${timerWait}`, j));
    }
    timeouts.push(setTimeout(numberNotFound, `${timerWait}`));
    return NaN;
}

// Sorting Algorithms

function insertionSort(arr, r=0, timerWait=animationWait)
{
    if (r === arr.length)
        return arr;
    let ins = r - 1;

    while (r > 0 && arr[ins] > arr[ins + 1])
    {
        [arr[ins], arr[ins + 1]] = [arr[ins + 1], arr[ins]];
        timeouts.push(setTimeout(swapBars, `${timerWait}`, ins, ins + 1));
        ins--;
    }
    timeouts.push(setTimeout(searching, `${timerWait}`, r));
    return insertionSort(arr, r + 1, timerWait=timerWait+animationWait);
}

function bubbleSort(arr)
{
    const iterWait = 5 * animationWait
    let timerWait = 0;
    let time1;
    for (let i = arr.length - 1; i > 0; i--)
    {
        timerWait += Math.floor(iterWait / i);
        for (let j = 0; j < i; j++)
        {
            if (j > 0)
                timeouts.push(setTimeout(clear,`${timerWait}`, j - 1));

            timeouts.push(setTimeout(searched, `${timerWait}`, j));
            timeouts.push(setTimeout(searched, `${timerWait}`, j + 1));

            timerWait += Math.floor(iterWait / i);
            if (arr[j] > arr[j + 1])
            {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                timeouts.push(setTimeout(swapBars, `${timerWait}`, j, j + 1));
            }
        }
        if (i > 0)
            timeouts.push(setTimeout(clear,`${timerWait}`, i - 1));

        timeouts.push(setTimeout(searching, `${timerWait}`, i));
        timerWait += Math.floor(iterWait / i);
    }
    return arr;
}

function mergeSort(arr, l=0)
{
    if (arr.length == 1)
        return arr;

    const mid = Math.floor(arr.length / 2);

    const arr1 = mergeSort(arr.slice(0, mid), l);
    const arr2 = mergeSort(arr.slice(mid), l + mid);
    return merge(arr1, arr2, l);
}

function merge(arr1, arr2, l)
{
    const n1 = arr1.length, n2 = arr2.length;
    const arr = new Array(n1 + n2);
    let m1 = 0, m2 = 0, m = 0;
    while (m1 < n1 && m2 < n2)
    {
        if (arr1[m1] < arr2[m2])
            arr[m++] = arr1[m1++];
        else
            arr[m++] = arr2[m2++];
    }

    while (m1 < n1)
        arr[m++] = arr1[m1++];

    while (m2 < n2)
        arr[m++] = arr2[m2++];

    for (let j = 0, n = arr.length; j < n; j++)
    {
        timeouts.push(setTimeout(fixBar, `${mergeWait}`, l + j, arr[j]));
        timeouts.push(setTimeout(searching, `${mergeWait}`, l + j));
    }

    mergeWait += animationWait;
    return arr;
}
