import {
    readData,
    formatXAxisTick,
} from "./utils.js"


async function makeChart3() {
    let data = await readData();
    data = data.slice(0, 20);
    // data = data.sort((a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));

    // country : denmark
    // ranking : d.ranking
    // player : d
    let high_ranking = []
    data.forEach((d) => {
        if (!high_ranking.some(item => item["country"] === d.country)) {
             high_ranking.push({
                 country: d.country,
                 ranking: d.ranking,
                 player: d,
             });
        }
    })
    // console.log(high_ranking);
    high_ranking.sort((a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));

    let svg = d3.select("#chart-svg-3");
    let margin = {top: 30, right: 30, bottom: 30, left: 40};
    let width = +svg.attr("width") - margin.left - margin.right;
    let height = +svg.attr("height") - margin.top - margin.bottom;

    let x_scale = d3.scaleBand()
        .domain(high_ranking.map(d => d["country"]))
        .range([0, 520])
        .padding(0.1);

    let y_scale = d3.scaleLinear()
        .domain([0, 1]) // 1 / ranking
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
    // there be optional setting
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
        .text("Ranking");

    let generate = d3.line()
        .x((d) => x_scale(d["country"]))
        .y((d) => y_scale(1 / +d["ranking"]));

    g.append("path")
        .datum(high_ranking)
        .attr("transform", `translate(${25}, 0)`)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", generate)
        .on("click", (e, d) => {
            let ox = (e.offsetX - 50) % 50;
            if (ox >= 0 && ox <= 40) {
                let d = high_ranking[Math.floor((e.offsetX - 60) / 50)];
                alert(`${d.country} top 1 player ranking in the world ${d.ranking}, name ${d.player.player_name}`);
                console.log(d);
            }
        })

    // title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        // .style("font-weight", "")
        .attr("opacity", 0.8)
        .attr("fill", "gray")
        .text("the top 1 player in their countries from the top 20 all over the world");
}

export {makeChart3};