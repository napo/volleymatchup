document.addEventListener("DOMContentLoaded", function() {
    var s = Snap("#svg");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };
    var sfondoSize = Math.min(width, height) * 0.5;
    var esternoSize = sfondoSize * 0.8;
    var internoSize = esternoSize * 0.8;
    var colors = ["#FF6347", "#FFD700", "#ADFF2F", "#40E0D0", "#1E90FF", "#DA70D6"];
    var rotations = { esterno: 0, interno: 0 };

    // Calcola i punti per gli esagoni
    function calculateHexagonPoints(center, size) {
        var points = [];
        for (let i = 0; i < 6; i++) {
            let angle = 2 * Math.PI / 6 * (i - 2); // Parte dallo spicchio in basso a sinistra
            points.push([center.x + size * Math.cos(angle), center.y + size * Math.sin(angle)]);
        }
        return points;
    }

    // Disegna gli esagoni con specifiche per sfondo, esterno e interno
    function drawHexagon(name, points, color, rotate) {
        var hexGroup = s.group();
        points.forEach((point, i, arr) => {
            let nextIndex = (i + 1) % arr.length;
            let pathString = `M${center.x},${center.y} L${point.join(",")} L${arr[nextIndex].join(",")} Z`;

            // Specifiche per "sfondo": solo contorno e numeri
            if (name === "sfondo") {
                hexGroup.add(s.path(pathString).attr({ fill: "none", stroke: "#000", strokeWidth: 1 }));
                if (i === 0) { // Aggiunge numeri solo una volta per spicchio
                    let midPoint = [(point[0] + arr[nextIndex][0]) / 2, (point[1] + arr[nextIndex][1]) / 2];
                    let textPos = [(midPoint[0] + center.x) / 2, (midPoint[1] + center.y) / 2];
                    hexGroup.add(s.text(textPos[0], textPos[1], `${i + 1}`).attr({ fontSize: '16px', textAnchor: 'middle' }));
                }
            } else {
                // Specifiche per "esterno" e "interno": colore e linee tratteggiate
                hexGroup.add(s.path(pathString).attr({ fill: colors[i], stroke: "#000", strokeWidth: 1 }));
                let midPoint = [(point[0] + arr[nextIndex][0]) / 2, (point[1] + arr[nextIndex][1]) / 2];
                hexGroup.add(s.line(center.x, center.y, midPoint[0], midPoint[1]).attr({"stroke-dasharray": "5, 5", stroke: "#000"}));
            }
        });

        // Aggiunge rotazione ad "esterno" e "interno"
        if (rotate) {
            hexGroup.click(function() {
                rotations[name] += 60; // Aggiunge 60 gradi ad ogni clic
                this.animate({ transform: `r${rotations[name]},${center.x},${center.y}` }, 1000, mina.linear);
            });
        }
    }

    // Calcola i punti e disegna gli esagoni
    var sfondoPoints = calculateHexagonPoints(center, sfondoSize);
    var esternoPoints = calculateHexagonPoints(center, esternoSize);
    var internoPoints = calculateHexagonPoints(center, internoSize);

    // Disegna "sfondo" senza rotazione e con numeri
    drawHexagon("sfondo", sfondoPoints, "none", false);
    // Disegna "esterno" e "interno" con rotazione, colori e linee tratteggiate
    drawHexagon("esterno", esternoPoints, colors, true);
    drawHexagon("interno", internoPoints, colors, true);
});
``

