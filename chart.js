// Initial data
let data = [
    { x: 10, y: 20 },
    { x: 40, y: 80 },
    { x: 60, y: 40 }
];

// Set up SVG
const svg = d3.select("#myChart");
const tooltip = d3.select("#tooltip")
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

// Add the X Axis
g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

// Add the Y Axis
g.append("g")
    .call(d3.axisLeft(yScale));

// Line generator
const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y)); //Uses scales to map datapoints to their respective positions in the SVG


// Function to handle mouseover event
function mouseover(event, d) {
    tooltip.style("opacity", 1);
    tooltip.html(`X: ${d.x}<br>Y: ${d.y}`)
           .style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 28) + "px");
}

// Function to handle mouseout event
function mouseout() {
    tooltip.style("opacity", 0);
}

// Function to update the line and circles
function updateChart() {
    // Bind the data to the line
    const linePath = g.selectAll(".line")
                      .data([data]);

    linePath.enter().append("path")
        .attr("class", "line")
        .merge(linePath) //used to combine the enter and update selections, allowing you to apply the same modifications to both new and existing elements
        .transition()
        .duration(750)
        .attr("d", line) //apply line generator to new and existing line paths to draw the line
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Bind the data to the circles
    const circles = g.selectAll("circle").data(data);

    // Enter new data
    circles.enter().append("circle")
        .attr("r", 5)
        .style("fill", "steelblue")
        .merge(circles)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .transition()
        .duration(750)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y));

    // Remove old data
    circles.exit().remove();
}

// Initial update
updateChart();

// Function to add new data point and update the chart
function addDataPoint(newPoint) {
    data.push(newPoint);
    updateChart();
}

// Function to add a random data point
function addRandomDataPoint() {
  const newX = Math.random() * 100;
  const newY = Math.random() * 100;
  addDataPoint({ x: newX, y: newY });
}

// Select the button and set up a click event listener
d3.select("#addDataBtn").on("click", addRandomDataPoint);

// Example: Add new data point after 2 seconds
setTimeout(() => {
    addDataPoint({ x: 80, y: 60 });
}, 2000);