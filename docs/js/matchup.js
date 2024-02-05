document.addEventListener("DOMContentLoaded", function() {
    var s = Snap("#svg");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };
    var sfondoSize = Math.min(width, height) * 0.5;
    var esternoSize = sfondoSize * 0.8;
    var internoSize = esternoSize * 0.8;
    var colors = ["#FF6347", "#FFD700", "#ADFF2F", "#40E0D0", "#1E90FF", "#DA70D6"];

    // Mantiene traccia delle rotazioni attuali per esterno e interno
    var currentRotations = { esterno: 0, interno: 0 };

    function calculateHexagonPoints(center, size) {
        var points = [];
        for (let i = 0; i < 6; i++) {
            let angle = 2 * Math.PI / 6 * i - Math.PI / 2;
            points.push([center.x + size * Math.cos(angle), center.y + size * Math.sin(angle)]);
        }
        return points;
    }

    function drawHexagon(name, points, colors, isClickable) {
        var hexGroup = s.group();
        points.forEach((point, i, arr) => {
            let nextIndex = (i + 1) % arr.length;
            let spicchio = s.path(`M${center.x},${center.y} L${point.join(",")} L${arr[nextIndex].join(",")} Z`)
                            .attr({ fill: name === "sfondo" ? "none" : colors[i % colors.length], stroke: "#000", strokeWidth: 1 });
            hexGroup.add(spicchio);

            if (name !== "sfondo") {
                let midPoint = [(point[0] + arr[nextIndex][0]) / 2, (point[1] + arr[nextIndex][1]) / 2];
                let lineLength = Math.sqrt(Math.pow(point[0] - arr[nextIndex][0], 2) + Math.pow(point[1] - arr[nextIndex][1], 2));
                let textOffset = lineLength * 0.02; // Distanza del 2% dalla lunghezza del lato
                let textPosition = calculateTextPosition(point, arr[nextIndex], textOffset);

                hexGroup.add(s.line(center.x, center.y, midPoint[0], midPoint[1])
                             .attr({"stroke-dasharray": "5, 5", stroke: "#000", strokeWidth: 1 }));

                // Aggiunge le etichette "B" e "R" all'interno degli spicchi
                hexGroup.add(s.text(textPosition.B.x, textPosition.B.y, `B${i + 1}`)
                             .attr({ fontSize: '16px', textAnchor: 'middle', fill: '#000' }));
                hexGroup.add(s.text(textPosition.R.x, textPosition.R.y, `R${i + 1}`)
                             .attr({ fontSize: '16px', textAnchor: 'middle', fill: '#000' }));
            }
        });

        if (isClickable) {
            hexGroup.click(function() {
                currentRotations[name] += 60; // Aggiorna la rotazione corrente
                hexGroup.animate({ transform: `r${currentRotations[name]},${center.x},${center.y}` }, 1000);
            });
        }
    }

    function calculateTextPosition(startPoint, endPoint, offset) {
        let midPoint = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2];
        let angle = Math.atan2(endPoint[1] - startPoint[1], endPoint[0] - startPoint[0]);
        let dx = Math.cos(angle) * offset;
        let dy = Math.sin(angle) * offset;

        // Calcola le posizioni di "B" e "R" mantenendole parallele al lato ma all'interno dello spicchio
        let Bx = midPoint[0] - dy;
        let By = midPoint[1] + dx;
        let Rx = midPoint[0] + dy;
        let Ry = midPoint[1] - dx;

        return { B: { x: Bx, y: By }, R: { x: Rx, y: Ry } };
    }

    var sfondoPoints = calculateHexagonPoints(center, sfondoSize);
    var esternoPoints = calculateHexagonPoints(center, esternoSize);
    var internoPoints = calculateHexagonPoints(center, internoSize);

    drawHexagon("sfondo", sfondoPoints, [], false); // Sfondo senza clic
    drawHexagon("esterno", esternoPoints, colors, true); // Esterno cliccabile
    drawHexagon("interno", internoPoints, colors, true); // Interno cliccabile
});

