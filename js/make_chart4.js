import {
    readData,
    formatXAxisTick,
    get_country_color,
} from "./utils.js"

import {
    CHART4_BAR_X_MAX_VALUE,
} from "./value.js"


async function makeChart4() {
    let data = await readData();
    data = data.slice(0, 20);
    data = data.sort((a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));

    let svg = d3.select("#chart-svg-4");
    let margin = {top: 30, right: 30, bottom: 30, left: 100};
    let width = +svg.attr("width") - margin.left - margin.right;
    let height = +svg.attr("height") - margin.top - margin.bottom;

    let x_scale = d3.scaleLinear()
        .domain([0, CHART4_BAR_X_MAX_VALUE])
        .range([0, width]);

    console.log(data.map(d => d.player_name));

    let y_scale = d3.scaleBand()
        .domain(data.map(d => d.player_name))
        .range([height, 0])
        .padding(0.1);

    let g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // x axis
    g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scale).tickFormat(formatXAxisTick));

    // x label
    g.append("text")
        .attr("class", "label-x")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("font-size", "10px")
        .attr("fill", "gray")
        .attr("text-anchor", "middle")
        .text("Points of player");

    // y axis
    g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y_scale));

    // y label
    // g.append("text")
    //     .attr("class", "label-y")
    //     .attr("transform", "translate(-" + (margin.left - 5) + ",0)")
    //     .attr("dy", "0.35em")
    //     .attr("font-size", "12px")
    //     .attr("fill", "gray")
    //     .attr("text-anchor", "middle")
    //     .attr("transform", "rotate(-90)")
    //     .text("Player name");

    // bars
    data.forEach((d, idx)=> {
        g.append("rect")
            .attr("class", "bar-4")
            .attr("id", `tag-${idx}`)
            .attr("width",0)
            .attr("height", y_scale.bandwidth())
            .attr("x", 0)
            .attr("y", y_scale(d.player_name))
            .attr("fill", get_country_color(d.country))
            .on("click", (e) => {
                alert(`Player ${d.player_name} has ${d.points} points, ranked ${d.rank} in the world, and he is from ${d.country}`);
            })
    })

    data.forEach(d => {
        d.currentPoints = 0;
    });

    let timer = setInterval(() => {
        data.forEach((d, idx) => {
            d.currentPoints = Math.min(d.currentPoints + d.points * 0.1, d.points);

            d3.select(`#tag-${idx}`)
                // .transition()
                // .duration(1000)
                .attr("width", x_scale(d.currentPoints))

            if (d.currentPoints >= d.points) {
                clearInterval(timer);
            }
        });
    }, 150);

    // title
    g.append("text")
        .attr("class", "title-4")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("font-size", "18px")
        .attr("opacity", 0.5)
        .attr("text-anchor", "middle")
        .text("Top 20 players all over the world");

}

export { makeChart4 };