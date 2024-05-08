function formatXAxisTick(d) {
    if (d.length > 10) {
        return d.substring(0, 8) + "...";
    } else {
        return d;
    }
}

function get_country_color(country) {
    switch (country) {
        case "China":
            return "red";
        case "Chinese Taipei":
            return "orange";
        case "Denmark":
            return "blue";
        case "Hong Kong China":
            return "purple";
        case "India":
            return "green";
        case "Indonesia":
            return "brown";
        case "Japan":
            return "teal";
        case "Malaysia":
            return "pink";
        case "Singapore":
            return "cyan";
        case "Thailand":
            return "magenta";
        default:
            return "steelblue"; // 默认颜色
    }
}

async function readData() {
    return await d3.csv("./file/men_single.csv");
}

export { formatXAxisTick };
export { get_country_color };
export { readData };
