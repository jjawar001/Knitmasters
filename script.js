// document.body.classList.toggle('dark');

// TIMER BTNS
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
pauseBtn.disabled = true;
const resetBtn = document.getElementById('reset-btn');

// TIMER
const hrsCount = document.getElementById('hours');
const minsCount = document.getElementById('minutes');
const secsCount = document.getElementById('seconds');

// MODAL
const modalContainer = document.getElementById('modal-container');
const takeBreakCheck = document.getElementById('take-breaks');
const breakOverBtn = document.getElementById('break-over-btn');

// NEW ROW BTNS
const newRowBtn = document.getElementById('new-row-btn');
newRowBtn.disabled = true;
const clearDataBtn = document.getElementById('clear-btn');

// ROW DATA
const avgTime = document.getElementById('avg-time');
const timeRemaining = document.getElementById('time-remaining');
const rowsAmnt = document.getElementById('rows-amount');
const percentBar = document.getElementById('percent-completed-bar');
const percentNum = document.getElementById('percent-completed-number');
const rowList = document.getElementById('row-list');

// ===================================================
// global variables
let knittimer;
let count = 0;
let lastRowTimeStamp = 0;
let paused = false;
let rowArr = [];

// ===================================================
// EVENT LISTENERS
startBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (knittimer) return;

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  newRowBtn.disabled = false;

  lastRowTimeStamp = 0;

  knittimer = setInterval(startTimer, 1000);
  setData();
});

resetBtn.addEventListener('click', (e) => {
  resetTimer();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  newRowBtn.disabled = true;
});

pauseBtn.addEventListener('click', (e) => {
  pauseTimer();
});

newRowBtn.addEventListener('click', () => {
  addNewRow();
  setData();
});

clearDataBtn.addEventListener('click', () => {
  resetData();
});

breakOverBtn.addEventListener('click', () => {
  paused = !paused;
  modalContainer.style.display = 'none';
});

// ===================================================
// HELPER FUNCTIONS

function startTimer() {
  if (paused) return;

  const { hrs, mins, secs } = formatTime(count);

  hrsCount.textContent = hrs;
  minsCount.textContent = mins;
  secsCount.textContent = secs;

  // if (count > 0 && count % 1500 === 0) {
  if (count > 0 && count % 10 === 0) {
    controlModal();
  }

  count++;
}

function controlModal() {
  if (!takeBreakCheck.checked) return;

  paused = !paused;

  const breakDuration = document.getElementById('break-duration');
  const minutesWorking = document.getElementById('minutes-working');

  minutesWorking.textContent = Math.floor(count / 1500);
  breakDuration.textContent = 5;
  modalContainer.style.display = 'unset';
}

function resetTimer() {
  clearInterval(knittimer);
  startBtn.disabled = false;
  knittimer = null;
  count = 0;
  paused = false;
  hrsCount.textContent = '00';
  minsCount.textContent = '00';
  secsCount.textContent = '00';
}

function pauseTimer() {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
}

function setData() {
  const total = Number(rowsAmnt.value);
  if (isNaN(total) || total <= 0) {
    percentBar.style.width = '0%';
    percentNum.textContent = '0';
    avgTime.textContent = '0 min';
    timeRemaining.textContent = '0 min';
  } else {
    percentBar.style.width =
      rowArr.length < total ? (rowArr.length / total) * 100 + '%' : '100%';
    percentNum.textContent = ((rowArr.length / total) * 100).toFixed(0);

    const avg = rowArr.reduce((a, b) => a + b, 0) / rowArr.length;
    const { hrs, mins, secs } = formatTime(avg);
    avgTime.textContent = isNaN(avg)
      ? `0 mins`
      : `${hrs} hrs ${mins} mins ${secs} secs`;

    const remainingRows = total - rowArr.length;
    const estimate = avg * remainingRows;
    const { hrs: estHrs, mins: estMins, secs: estSecs } = formatTime(estimate);
    timeRemaining.textContent = isNaN(estimate)
      ? `0 mins`
      : `${estHrs} hrs ${estMins} mins ${estSecs} secs`;
  }
}

function addNewRow() {
  const rowTime = count - lastRowTimeStamp;
  lastRowTimeStamp = count;

  const { hrs, mins, secs } = formatTime(rowTime);

  const newRow = document.createElement('li');
  newRow.classList.add('counted-row');
  newRow.innerHTML = `
    <strong>Row <span class="row-number"> ${
      rowArr.length + 1
    }</span>: </strong> 
    <span class="row-time"> ${hrs} hrs ${mins} mins ${secs} secs</span>
  `;
  rowList.insertAdjacentElement('beforeEnd', newRow);
  rowArr.push(rowTime);
}

function resetData() {
  avgTime.textContent = '0 min';
  timeRemaining.textContent = '0 min';
  rowArr = [];
  percentNum.textContent = 0;
  percentBar.style.width = '0%';
  rowList.innerHTML = '';
}

function formatTime(seconds) {
  return {
    hrs: String(Math.floor(seconds / 3600)).padStart(2, '0'),
    mins: String(Math.floor(seconds / 60) % 60).padStart(2, '0'),
    secs: String(seconds % 60).padStart(2, '0'),
  };
}
