let speedValues = [];
let averageValue = 0.0;

let testsAmount = 0;

let startTime, endTime;

let imageSize = "";
let imageForDownload = new Image();
let randomImageLink = "https://source.unsplash.com/random?topics=nature";

const speedValueText = document.querySelector(".speed-value-block");
const checkButton = document.querySelector(".check-btn");
const resetButton = document.querySelector(".reset-btn");

const testsCountInput = document.querySelector(".tests-count-input");
const speedValueTestsList = document.querySelector(".sv-list");

function calculateInternetSpeed() {
  // Seconds
  let duration = (endTime - startTime) / 1000;
  let totalLoadedBits = imageSize * 8;

  let valueBs = (totalLoadedBits / duration).toFixed(2);
  let valueKBs = (valueBs / 1024).toFixed(2);
  let valueMBs = (valueKBs / 1024).toFixed(2);

  if (speedValues.length < testsAmount) {
    speedValueText.innerHTML = `${valueMBs} Mbs`;
    speedValues.push(parseFloat(valueMBs));
    initSpeedValueTestItem(valueMBs, speedValues.length);
  }
}

imageForDownload.onload = async function () {
  endTime = new Date().getTime();

  // Get image size
  await fetch(randomImageLink).then((response) => {
    imageSize = response.headers.get("content-length");
    calculateInternetSpeed();
  });
};
const init = async () => {
  startTime = new Date().getTime();
  imageForDownload.src = randomImageLink;
};

checkButton.addEventListener("click", function () {
  testsAmount = parseInt(testsCountInput.value);
  if (testsAmount != null && testsAmount != "" && testsAmount != 0) {
    if (testsAmount > 0 && testsAmount <= 10) {
      checkButton.innerHTML = "🔁 Checking...";
      checkButton.disabled = true;
      let timer = setInterval(() => {
        init();
        console.log(speedValues);
        if (speedValues.length == testsAmount) {
          clearInterval(timer);
          getAverageSpeed(speedValues);
          checkButton.innerHTML = "⚡ Check";
          checkButton.disabled = false;
        }
      }, 2500);
      resetButton.addEventListener("click", function () {
        reset(timer);
      });
    }
  }
});

function getAverageSpeed(values) {
  let count = values.length;
  let sum = 0.0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    console.log("SUM IS " + sum);
  }
  averageValue = sum / count;
  speedValueText.innerHTML = `${averageValue.toFixed(2)} Mbs`;
  speedValueText.style.color = "green";
}

function initSpeedValueTestItem(speedValue, testNum) {
  const svItem = document.createElement("div");
  svItem.className = "sv-item";

  const svName = document.createElement("p");
  svName.className = "sv-item-name";
  svName.textContent = `✔️ Test ${testNum}`;
  const svValue = document.createElement("p");
  svValue.className = "sv-item-value";
  svValue.textContent = `${speedValue} Mbs`;

  svItem.appendChild(svName);
  svItem.appendChild(svValue);

  speedValueTestsList.appendChild(svItem);
}

function reset(timer) {
  speedValueTestsList.innerHTML = "";
  speedValueText.textContent = "Start";
  speedValues = [];
  averageValue = 0.0;
  clearInterval(timer);
  checkButton.innerHTML = "⚡ Check";
  checkButton.disabled = false;
  speedValueText.style.color = "rgb(246, 158, 16)";
  testsCountInput.value = "";
}
