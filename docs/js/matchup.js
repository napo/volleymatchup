document.addEventListener("DOMContentLoaded", function() {
    var s = Snap("#svg");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };
    var outerHexagonSize = Math.min(width, height) * 0.45;
    var innerHexagonSize = outerHexagonSize * 0.8;
    var colors = ["#FF6347", "#FFD700", "#ADFF2F", "#40E0D0", "#1E90FF", "#DA70D6"]; // Colori uguali per entrambi gli esagoni

    function calculateHexagonPoints(center, size) {
        var points = [];
        for (let i = 0; i < 6; i++) {
            let angle = Math.PI / 3 * i;
            points.push([center.x + size * Math.cos(angle), center.y + size * Math.sin(angle)]);
        }
        return points;
    }

    function drawHexagon(points, colors, offsetForText) {
        var hexGroup = s.group();
        points.forEach((point, i) => {
            let nextIndex = (i + 1) % 6;
            let midPoint = [(point[0] + points[nextIndex][0]) / 2, (point[1] + points[nextIndex][1]) / 2];
            let path = `M${center.x},${center.y} L${point.join(",")} L${points[nextIndex].join(",")} Z`;
            hexGroup.add(s.path(path).attr({fill: colors[i], stroke: "#000", strokeWidth: 1}));

            // Linea tratteggiata dal centro allo spicchio
            let linePath = `M${center.x},${center.y} L${midPoint[0]},${midPoint[1]}`;
            hexGroup.add(s.path(linePath).attr({"stroke-dasharray": "5, 5", stroke: "#000", strokeWidth: 1}));

            // Calcolo posizione testo
            let textAngle = Math.PI / 3 * i + Math.PI / 6;
            let textPos = [center.x + offsetForText * Math.cos(textAngle), center.y + offsetForText * Math.sin(textAngle)];
            hexGroup.add(s.text(textPos[0], textPos[1] - 10, `B${i+1}`).attr({fontSize: '16px', textAnchor: 'middle'}));
            hexGroup.add(s.text(textPos[0], textPos[1] + 10, `R${i+1}`).attr({fontSize: '16px', textAnchor: 'middle'}));
        });

        // Rotazione al clic
        hexGroup.click(function() {
            hexGroup.animate({transform: `r60,${center.x},${center.y}`}, 1000);
        });

        return hexGroup;
    }

    let outerPoints = calculateHexagonPoints(center, outerHexagonSize);
    drawHexagon(outerPoints, colors, outerHexagonSize * 0.9);

    let innerPoints = calculateHexagonPoints(center, innerHexagonSize);
    drawHexagon(innerPoints, colors, innerHexagonSize * 0.7);
  
   
});

