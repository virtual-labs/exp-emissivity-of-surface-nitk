const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");

btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage))
);

let steadyState = 0;
let currentVoltage = 0;
//controls section
let v = 0;
let vf = 0;

//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
let time = 0;
let time1 = 0;
let time2 = 0;

//point tracing section and initial(atmospheric section)
let t1 = [ 26, 26, 27.1, 27.5, 26.5, 26.8];
let th = [55, 55, 55, 55, 55];
let off = [0, 0, 0, 0, 0];
let slope = [-282.86, -315.71, -354.29];
let k = [40.83, 37.99, 37.61];

//temporary or dummy variables for locking buttons
let temp = 0;
let temp1 = 2;
let temp2 = 0;
let tempslope = 0;
let tempk = 0;

function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    if (temp2 == 1) {
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "Please enter a value rounded upto three decimal points";
    } else {
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      document.querySelector(".graph-div").classList.remove("hide");
      document.querySelector(".questions").classList.add("hide");
    }
  }
}
//Change in Variables with respect to time
function varinit() {
  console.log(currentVoltage, vf);
  if(time2 > 0){ t1[0] += off[0];};
  if(time2 > 0){ t1[1] += off[1];};
  if(time2 > 0){t1[2] += off[2];};
  if(time2 > 0){t1[3] += off[3];};
  if(time2 > 0){t1[4] += off[4];};

  vfspinner.textContent = vf;
  temperature1.textContent = t1[0].toFixed(2);
  temperature2.textContent = t1[1].toFixed(2);
  temperature3.textContent = t1[2].toFixed(2);
  temperature4.textContent = t1[3].toFixed(2);
  temperature5.textContent = t1[4].toFixed(2);
}

//water temperature changes
function watertemp() {
  switch (vf) {
    case 26:
      t1[6] += 2.2;
      break;
    case 54:
      t1[6] += 1.2;
      break;
    case 60:
      t1[6] += 1.2;
      break;
  }
}

//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    watertemp();
   

    ctx.clearRect(620, 485, 100, 50);
    // t1[6] = t1[6].toFixed(1);
    ctx.font = "15px Comic Sans MS";
   
  } else {
    drawGradient();
    steadyState = 5 - Math.round(time1);
    document.querySelector(
      ".comment"
    ).innerHTML = `Wait for  ${steadyState} seconds for steady state`;
    btnReset.setAttribute("disabled", true);
    if (steadyState === 0) {
      temp2 = 0;
      document.querySelector(
        ".comment"
      ).innerHTML = `The steady state is achieved
`;
btnReset.removeAttribute("disabled");
    }
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient(){
  
  //cross sectional simulation
  var x = 260,
    y = 175,
    // Radii of the white glow.
    innerRadius = .1*time1,
    outerRadius = 20*time1,
    // Radius of the entire circle.
    radius = 50;

var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
//gradient.addColorStop(0, 'white');
gradient.addColorStop(0, 'red');
gradient.addColorStop(1,"white");

ctx.arc(260, 175, radius, 0, 100 * Math.PI);

ctx.fillStyle = gradient;
ctx.fill();

  // //thermometer heights add offset
   if(time1 > 0){  th[0] += .8;};
   if(time1 > 0){  th[1] += .75;};
   if(time1 > 0){  th[2] += .6;};
   if(time1 > 0){  th[3] += .65;}; 
   if(time1 > 0){  th[4] += .4;};
   //if(time1 > 2){  th[5] += .35;};

   //thermometers drawing
    ctx.fillStyle = "black";
    ctx.lineJoin = "round";

   //thermometer reading
   ctx.beginPath();
   ctx.fillRect(269, 492, 1.5, -th[0]);
   ctx.fillRect(334.25, 492, 1.5, -th[1]);
   ctx.fillRect(394.25, 492, 1.5, -th[2]);
   ctx.fillRect(460,    492, 1.5, -th[3]);
   ctx.fillRect(520, 492, 1.5, -th[4]);
   //ctx.fillRect(525.25, 355, 1.5, -th[5]);
   ctx.arc(261, 175, 50, 0, 2 * Math.PI);   
   ctx.stroke();
   ctx.beginPath();
   ctx.arc(540, 175, 50, 0, 2 * Math.PI);
   
   ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.arc(540, 175, radius, 0, 2 * Math.PI);
    ctx.fill();
}

// initial model
function drawModel() {
  ctx.clearRect(10, 20, 487, 370); //clears the complete canvas#simscreen everytime

  var background = new Image();
  background.src = "./images//modelnew.png";
  document.getElementsByClassName("comment1")[0].innerHTML="All temperature are in °C"
  // printcomment("All temperatures should be in kelvin", 0)
  console.log("tem")

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function () {
    //550,400
    ctx.drawImage(background,160, 75, 480, 460);
    ctx.clearRect(80, 300, 70, 110);
    ctx.font = "15px Comic Sans MS";

    drawGradient();
  };
}

function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
   
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    if (currentVoltage == 5) {
      vf = 50;
    } else if (currentVoltage == 10) {
      vf = 55;
    } else if (currentVoltage == 15) {
      vf = 60;
    }
    offset();
  }
}

//offset for thermometer and temp change
function offset() {
  if (currentVoltage == 5) {
    //path = "./images//currentVoltage1.jpg";
    off[0] = 21.2;
    off[1] = 21.6;
    off[2] = 24.18;
    off[3] = 23.5;
    off[4] = 5.1;
  } else if (currentVoltage == 10) {
    //path = "./images//currentVoltage2.jpg";
    off[0] = 24;
    off[1] = 24.6;
    off[2] = 27.78;
    off[3] = 27.3;
    off[4] = 6.1;
  } else if (currentVoltage == 15) {
    //path = "./images//currentVoltage3.jpg";
    off[0] = 28;
    off[1] = 28.2;
    off[2] = 32.78;
    off[3] = 32.3;
    off[4] = 7.3;
  }
  // temp1 = 0;
  // temp2 = 1;
}
function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
  }
}

//Calculations of the experienment
function validation() {
  datapoints = [
    { x: 0.07, y: t1[0] },
    { x: 0.14, y: t1[1] },
    { x: 0.21, y: t1[2] },
    { x: 0.28, y: t1[3] },
    { x: 0.35, y: t1[4] },
  ];
  document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  // drawgraph("graph", datapoints, "Length in meter", "Temperature in degree C");
  if (currentVoltage == 5) {
    e = 0.808;
    tempk = k[0];
  } else if (currentVoltage == 10) {
    e = 0.778;
    tempk = k[1];
  } else if (currentVoltage == 15) {
    e = 0.74;
    tempk = k[2];
  }
  // btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
}


function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === e ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${e} `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function resetAll() {
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled");
    voltage.checked = false;
  });
  document.querySelector(".comment").innerHTML = "";
  // if (temp1 == 0) {
  temp2 = 0;
  temp1 = 2;
  t1 = [26, 26, 27.1, 27.5, 26.5];
  th = [45, 45, 45, 45, 45];
  currentVoltage = 0;
  vf = 0;
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = ``;
  document.querySelector(".question-input2").value = "";
  varinit();
  startsim();
  drawModel();
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
