
// JS File for hw05               
// Krishanu Datta and Zain Alam


// constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;



// add border to circle when clicked
function borderCircle(pointCircle) {
    pointCircle.classList.toggle('bordered');
};
  
// show coordinates of clicked circle
function coordCircle(pointCircle) {

    // get coordinates of the circle
    let xVal = pointCircle.getAttribute('cx') / 50
    let yVal = (FRAME_WIDTH - pointCircle.getAttribute('cy')) / 50

    // show coordinates of the point 
    let pointDisplay = 'Coordinates: (' + xVal + ',' + yVal + ')';
    document.getElementById('click-point').innerHTML = pointDisplay;
};



// function to set border + produce coordinates for each point
function ptClicked() {

    // gather all circle points
    let pointsCircle = document.getElementsByTagName("circle");

    for (let i = 0; i < pointsCircle.length; i++){
        pointsCircle[i].addEventListener('click', function(){borderCircle(pointsCircle[i])});
        pointsCircle[i].addEventListener('click', function(){coordCircle(pointsCircle[i])});
    }
};


ptClicked();


 // Add the point from dropdown selection of coordinates
  function addPoint() {

    let x = document.getElementById("x-coord");
    let y = document.getElementById("y-coord");

    // convert value to int
    let numX = Number(x.value);
    let numY = Number(y.value);

  
    let frame = document.getElementById('frame')

    // create circle
    let newCirc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    // calculate coordinates and set radius for circle
    let cx = (numX * 50);
    let cy = (FRAME_WIDTH - (numY * 50));

    newCirc.setAttribute("cx", cx);
    newCirc.setAttribute("cy", cy); 
    newCirc.setAttribute("r", 15); 


    // add new svg to frame + add click functions
    frame.appendChild(newCirc);

    newCirc.addEventListener('click', function(){borderCircle(newCirc)});
    newCirc.addEventListener('click', function(){coordCircle(newCirc)});

  };
  

  // add Event Listener to "create" button
  document.getElementById("create-pt").addEventListener("click", addPoint);
