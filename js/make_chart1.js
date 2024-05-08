
import {
    readData,
    formatXAxisTick,
    get_country_color,
} from "./utils.js"


// async function readData() {
//     return await d3.csv("./file/men_single.csv");
// }

async function makeChart1() {
    let data = await readData();
    data = data.slice(0, 20);
    data = data.sort((a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
    let cp_counts = [];
    data.forEach(item => {
        let country = item.country;
        let count = data.filter(dataItem => dataItem.country === country).length;

        let formattedItem = {
            "country": country,
            "count": count
        };

        // Check if the formattedItem is already in the formattedList
        let existingItemIndex = cp_counts.findIndex(item => item["country"] === country);
        if (existingItemIndex === -1) {
            cp_counts.push(formattedItem);
        }
    });
    // console.log(cp_counts);

    let svg = d3.select("#chart-svg-1");
    let margin = {top: 30, right: 30, bottom: 30, left: 30};
    let width = +svg.attr("width") - margin.left - margin.right;
    let height = +svg.attr("height") - margin.top - margin.bottom;

    let x_scale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, 550])
        .padding(0.1);

    let y_scale = d3.scaleLinear()
        .domain([0, Math.max(...cp_counts.map(item => item.count)) + 1])
        .range([height, 0]);

    let g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // x axis
    g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scale).tickFormat(formatXAxisTick));

    // x label
    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "gray")
        .text("Country")

    // y axis
    g.append("g")
        // .attr("transform", `translate(${0}, ${height})`)
        // .attr("transform", "rotate(180)")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y_scale).ticks(5))
        // .call(g => g.select(".domain").remove())
        // .call(g => g.selectAll(".tick line").remove())
        .call(g => g.selectAll(".tick text")
            .attr("dy", "0.32em")
            .style("font-size", "10px")
            .style("fill", "gray"));

    // y label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left) // 调整y轴标签的y坐标
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "gray")
        .text("Count");

    // count
    g.selectAll(".bar")
        .data(cp_counts)
        .enter().append("rect")
        .attr("class", "bar-1")
        .attr("x", d => x_scale(d.country))
        .attr("height", d => height - y_scale(d.count))  // !! change height to y_scale(d.count)
        .attr("width", x_scale.bandwidth())
        .attr("y", d => y_scale(d.count))                // !!
        .attr("fill",  d => get_country_color(d.country))
        .on("click", (e, d) => {
            alert(`${d.country} has ${d.count} players in the top 20`);
        });

    g.append("text")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "gray")
        .text("How many top 20 players are there in these countries?");
}

export { makeChart1 };
