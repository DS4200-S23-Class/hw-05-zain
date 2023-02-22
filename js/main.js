
// create frame constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


//  creating scatter plot
// frame to append svgs to 
const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


// read in scatter data
d3.csv("data/scatter-data.csv").then((data) => { 

    
    // find max of x and y values
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

      // create scales to map x and y values to pixels 
      const X_SCALE = d3.scaleLinear() 
                        .domain([0, (MAX_X + 1)]) 
                        .range([0, VIS_WIDTH]); 
      const Y_SCALE = d3.scaleLinear() 
                        .domain([0, (MAX_Y + 1)]) 
                        .range([VIS_HEIGHT, 0]); 


    // append svg circle points based on data
  FRAME1.selectAll("point")  
      .data(data) 
      .enter()       
      .append("circle")  
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.bottom); })
        .attr("r", 8)
        .attr("class", "point");


    // function to change color of point on hover
    function hoverColor(){
        d3.select(this)
              .style("fill", "orange");
    };


    // function to remove color after hovered
    function revertColor(){
        d3.select(this)
              .style("fill", "seagreen");
    };
        

    // function to add border + display coordinates

    const PTSELECT = d3.select("#point-info")
                            .append("div");

        function selectCoor(d){
            const circle = d3.select(this);
            circle.classed("bordered", !circle.classed("bordered"));
            const xPt = X_SCALE.invert(circle.attr("cx"));
            const yPt = Y_SCALE.invert(circle.attr("cy"));
            PTSELECT.html("<br> Coordinate of Selected Point: (" + (Math.round(xPt) - 1) + "," + (Math.round(yPt) + 1) + ")");
        };


        // Add event listeners
    FRAME1.selectAll(".point")
          .on("mouseover", hoverColor) 
          .on("click", selectCoor)
          .on("mouseleave", revertColor);    


    // add x axis
        FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
                  "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE).ticks(10)) 
              .attr("font-size", '20px'); 

      // add y axis
        FRAME1.append("g") 
              .attr("transform", "translate(" + (MARGINS.left) + 
                    "," + (MARGINS.top) + ")") 
              .call(d3.axisLeft(Y_SCALE).ticks(10)) 
                .attr("font-size", '20px'); 

    // function to add point
    function addPoint(){
        const xcoord = d3.select("#xVal").property("value");
        const ycoord = d3.select("#yVal").property("value");

        FRAME1.append("circle")
        .attr("cx", (X_SCALE(xcoord) + MARGINS.left)) 
        .attr("cy", (Y_SCALE(ycoord) + MARGINS.bottom))
        .attr("r", 8)
        .attr("class", "point")
        .on("mouseover", hoverColor) 
        .on("click", selectCoor)
        .on("mouseleave", revertColor);  
    };

    //event listener for submit button
    d3.select("#coorButton")
    .on("click", addPoint); 

});




// new frame for bar plot
const FRAME2= d3.select("#vis2") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 



// read in bar data
d3.csv("data/bar-data.csv").then((data) => { 

        // create y axis scale based on amount column
        const MAX_AMT = d3.max(data, (d) => { return parseInt(d.amount); });
             
      const AMT_SCALE = d3.scaleLinear() 
                        .domain([MAX_AMT + 10, 0]) 
                        .range([0, VIS_HEIGHT]); 

     // create x axis scale based on category names
   const CATEGORY_SCALE = d3.scaleBand() 
                    .domain(data.map((d) => { return d.category; })) 
                    .range([0, VIS_WIDTH])
                    .padding(.2); 


    // plot bar based on data with rectangle svgs 
        FRAME2.selectAll("bar")  
            .data(data) 
            .enter()       
            .append("rect")  
              .attr("y", (d) => { return AMT_SCALE(d.amount) + MARGINS.bottom; }) 
              .attr("x", (d) => { return CATEGORY_SCALE(d.category) + MARGINS.left;}) 
              .attr("height", (d) => { return VIS_HEIGHT - AMT_SCALE(d.amount); })
              .attr("width", CATEGORY_SCALE.bandwidth())
              .attr("class", "bar");



     // append x axis 
     FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(CATEGORY_SCALE))
          .attr("font-size", '20px'); 


  // append y axis
    FRAME2.append("g") 
          .attr("transform", "translate(" + (MARGINS.left) + 
                "," + (MARGINS.top) + ")") 
          .call(d3.axisLeft(AMT_SCALE).ticks(10)) 
            .attr("font-size", '20px'); 


    // create new variable for tooltip
  const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 


    // Define event handler functions for tooltips/hovering
    function handleMouseover(event, d) {

      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1);

      // change bar color
      d3.select(this)
              .style("fill", "orange");

    };

    function handleMousemove(event, d) {

      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
              .style("left", (event.pageX + 10) + "px") 
              .style("top", (event.pageY - 50) + "px"); 
     
    };

    function handleMouseleave(event, d) {

      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 

      //revert to original bar color
      d3.select(this)
              .style("fill", "seagreen");
    };

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    


});
