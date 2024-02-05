document.addEventListener("DOMContentLoaded", function() {
    var s = Snap("#svg");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };
    var sfondoSize = Math.min(width, height) * 0.5;
    var esternoSize = sfondoSize * 0.8;
    var internoSize = esternoSize * 0.8;
    var colors = ["#FF6347", "#FFD700", "#ADFF2F", "#40E0D0", "#1E90FF", "#DA70D6"];
    
    // Inizializzazione delle rotazioni
    var rotation = { esterno: 0, interno: 0 };

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
        var rotationData = { angle: 0 }; // Angolo di rotazione per questo esagono

        points.forEach((point, i) => {
            let nextIndex = (i + 1) % points.length;
            let color = name === "sfondo" ? "#FFFFFF" : colors[i % colors.length];
            let spicchio = s.path(`M${center.x},${center.y} L${point.join(",")} L${points[nextIndex].join(",")} Z`)
                            .attr({ fill: color, stroke: "#000", strokeWidth: 1 });
            hexGroup.add(spicchio);

            if (name !== "sfondo") {
                // Aggiunge linee tratteggiate per "interno" ed "esterno"
                let midPoint = [(point[0] + points[nextIndex][0]) / 2, (point[1] + points[nextIndex][1]) / 2];
                hexGroup.add(s.line(center.x, center.y, midPoint[0], midPoint[1])
                             .attr({"stroke-dasharray": "5, 5", stroke: "#000", strokeWidth: 1 }));
            }
        });

        if (isClickable) {
            hexGroup.click(function() {
                rotationData.angle += 60; // Aggiorna l'angolo di rotazione
                hexGroup.animate({ transform: `r${rotationData.angle},${center.x},${center.y}` }, 1000);
            });
        }

        // Memorizza l'oggetto di rotazione per consentire aggiornamenti futuri
        rotation[name] = rotationData;
    }

    function addNumberingToSfondo(points) {
        points.forEach((point, i) => {
            var nextIndex = (i + 1) % points.length;
            var midPoint = [(point[0] + points[nextIndex][0]) / 2, (point[1] + points[nextIndex][1]) / 2];
            // Posiziona la numerazione più vicino al bordo esterno
            var labelPoint = [midPoint[0] * 0.95 + center.x * 0.05, midPoint[1] * 0.95 + center.y * 0.05];
            s.text(labelPoint[0], labelPoint[1], `${i + 1}`)
             .attr({fontSize: "16px", textAnchor: "middle", fill: "#000"});
        });
    }

    var sfondoPoints = calculateHexagonPoints(center, sfondoSize);
    var esternoPoints = calculateHexagonPoints(center, esternoSize);
    var internoPoints = calculateHexagonPoints(center, internoSize);

    // Disegno degli esagoni con specifiche funzioni
    drawHexagon("sfondo", sfondoPoints, [], false); // Sfondo con numerazione
    drawHexagon("esterno", esternoPoints, colors, true); // Esterno colorato e cliccabile
    drawHexagon("interno", internoPoints, colors, true); // Interno colorato e cliccabile
    addNumberingToSfondo(sfondoPoints); // Aggiungi numerazione a "sfondo"
});

