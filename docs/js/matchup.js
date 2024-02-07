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
    
    
function drawHexagon(name, points, colors, isClickable) {
    var spicchioHeight = Math.sqrt(Math.pow(center.x - points[0][0], 2) + Math.pow(center.y - points[0][1], 2));
    var offset = spicchioHeight * 0.1; // 5% dell'altezza dello spicchio
    var hexGroup = s.group();
  
 
    points.forEach((point, i, arr) => {
        let nextIndex = (i + 1) % arr.length;
        let spicchio = s.path(`M${center.x},${center.y} L${point.join(",")} L${arr[nextIndex].join(",")} Z`)
                        .attr({ fill: name === "sfondo" ? "none" : colors[i % colors.length], stroke: "#000", strokeWidth: 1 });
        hexGroup.add(spicchio);

            if (name === "interno") {
                let baseLength = Math.sqrt(Math.pow(point[0] - arr[nextIndex][0], 2) + Math.pow(point[1] - arr[nextIndex][1], 2));
                let midBasePoint = [(point[0] + arr[nextIndex][0]) / 2, (point[1] + arr[nextIndex][1]) / 2];
                let angleRad = Math.atan2(arr[nextIndex][1] - point[1], arr[nextIndex][0] - point[0]);

                // Calcolo dell'offset di 11 pixel verso l'interno dal centro della base dello spicchio
                let innerOffset = 0; // Offset verso l'interno
                let innerMidBasePoint = [
                    midBasePoint[0] - Math.cos(angleRad) * innerOffset,
                    midBasePoint[1] - Math.sin(angleRad) * innerOffset
                ];

                let textOffset = baseLength * 0.3; // Metà del 60% della lunghezza della base per posizionare le etichette "B" e "R"
                
                // Calcola le posizioni per le etichette "Bx" e "Rx"
                let BPosition = {
                    x: innerMidBasePoint[0] - Math.cos(angleRad) * textOffset,
                    y: innerMidBasePoint[1] - Math.sin(angleRad) * textOffset
                };
                let RPosition = {
                    x: innerMidBasePoint[0] + Math.cos(angleRad) * textOffset,
                    y: innerMidBasePoint[1] + Math.sin(angleRad) * textOffset
                };


                // Aggiunge le etichette "Bx" e "Rx" ruotate per essere parallele alla base dello spicchio
                hexGroup.add(s.text(BPosition.x, BPosition.y, `B${i + 1}`)
                             .attr({ fontSize: '16px', fill: '#000' })
                             .transform(`r${angleRad * (180/Math.PI)},${BPosition.x},${BPosition.y}`));
                hexGroup.add(s.text(RPosition.x, RPosition.y, `R${i + 1}`)
                             .attr({ fontSize: '16px', fill: '#000' })
                             .transform(`r${angleRad * (180/Math.PI)},${RPosition.x},${RPosition.y}`));
              
           	 // Calcola il punto medio della base di ogni spicchio

            	// Disegna una linea tratteggiata dal centro dell'esagono al punto medio della base dello spicchio
            	let dashedLine = s.line(center.x, center.y, midBasePoint[0], midBasePoint[1])
                              .attr({stroke: "#000", strokeWidth: 1, "stroke-dasharray": "5, 5"});
            	hexGroup.add(dashedLine);
            }

        if (name === "sfondo") {
            let midPoint = [(point[0] + arr[nextIndex][0]) / 2, (point[1] + arr[nextIndex][1]) / 2];
            let angle = Math.atan2(midPoint[1] - center.y, midPoint[0] - center.x);
            let offsetDistance = 15; // Offset di 7 pixel verso l'interno

            // Calcola la nuova posizione dell'etichetta con l'offset
            let labelPosition = {
                x: midPoint[0] - Math.cos(angle) * offsetDistance,
                y: midPoint[1] - Math.sin(angle) * offsetDistance
            };

            // Aggiunge l'etichetta numerata all'interno dello spicchio
            hexGroup.add(s.text(labelPosition.x, labelPosition.y, `${i + 1}`)
                         .attr({ fontSize: '20px', textAnchor: 'middle', fill: '#000' }));
        }
 	if (name == "esterno") {
                let baseLength = Math.sqrt(Math.pow(point[0] - arr[nextIndex][0], 2) + Math.pow(point[1] - arr[nextIndex][1], 2));
                let midBasePoint = [(point[0] + arr[nextIndex][0]) / 2, (point[1] + arr[nextIndex][1]) / 2];
                let angleRad = Math.atan2(arr[nextIndex][1] - point[1], arr[nextIndex][0] - point[0]);

                // Calcolo dell'offset di 11 pixel verso l'interno dal centro della base dello spicchio
                let innerOffset = 0; // Offset verso l'interno
                let innerMidBasePoint = [
                    midBasePoint[0] - Math.cos(angleRad) * innerOffset,
                    midBasePoint[1] - Math.sin(angleRad) * innerOffset
                ];

                let textOffset = baseLength * 0.3; // Metà del 60% della lunghezza della base per posizionare le etichette "B" e "R"
                
                // Calcola le posizioni per le etichette "Bx" e "Rx"
                let BPosition = {
                    x: innerMidBasePoint[0] - Math.cos(angleRad) * textOffset,
                    y: innerMidBasePoint[1] - Math.sin(angleRad) * textOffset
                };
                let RPosition = {
                    x: innerMidBasePoint[0] + Math.cos(angleRad) * textOffset,
                    y: innerMidBasePoint[1] + Math.sin(angleRad) * textOffset
                };


                // Aggiunge le etichette "Bx" e "Rx" ruotate per essere parallele alla base dello spicchio
                hexGroup.add(s.text(BPosition.x, BPosition.y, `R${i + 1}`)
                             .attr({ fontSize: '16px', fill: '#000' })
                             .transform(`r${angleRad * (180/Math.PI)},${BPosition.x},${BPosition.y}`));
                hexGroup.add(s.text(RPosition.x, RPosition.y, `B${i + 1}`)
                             .attr({ fontSize: '16px', fill: '#000' })
                             .transform(`r${angleRad * (180/Math.PI)},${RPosition.x},${RPosition.y}`));
              
           	 // Calcola il punto medio della base di ogni spicchio

            	// Disegna una linea tratteggiata dal centro dell'esagono al punto medio della base dello spicchio
            	let dashedLine = s.line(center.x, center.y, midBasePoint[0], midBasePoint[1])
                              .attr({stroke: "#000", strokeWidth: 1, "stroke-dasharray": "5, 5"});
            	hexGroup.add(dashedLine);
            }
        });

        if (isClickable) {
            hexGroup.click(function() {
                currentRotations[name] += 60; // Aggiorna la rotazione corrente
                hexGroup.animate({ transform: `r${currentRotations[name]},${center.x},${center.y}` }, 1000);
            });
        }
}
function calculateLabelPosition(center, midPoint, labelWidth, baseLength) {
    let dx = labelWidth / 2;
    let dy = (baseLength / 2) - dx; // Calcola il delta y per posizionare le etichette sulla stessa riga ma allineate ai lati

    // Calcola le posizioni per le etichette "Bx" e "Rx"
    let Bx = midPoint[0] - dx;
    let By = midPoint[1];
    let Rx = midPoint[0] + dx;
    let Ry = midPoint[1];

    return { B: { x: Bx, y: By }, R: { x: Rx, y: Ry } };
}

function calculateTextPosition(midPoint, textLength, angleDeg) {
    // Calcola lo spostamento basato sulla lunghezza del testo
    let dx = textLength / 2;
    let dy = 0; // Nessun spostamento verticale necessario per questo allineamento

    // Calcola le posizioni iniziali per "Bx" e "Rx"
    return {
        B: { x: midPoint[0] - dx, y: midPoint[1] - dy },
        R: { x: midPoint[0] + dx, y: midPoint[1] - dy }
    };
}
   

    var sfondoPoints = calculateHexagonPoints(center, sfondoSize);
    var esternoPoints = calculateHexagonPoints(center, esternoSize);
    var internoPoints = calculateHexagonPoints(center, internoSize);

    drawHexagon("sfondo", sfondoPoints, [], false); // Sfondo senza clic
    drawHexagon("esterno", esternoPoints, colors, true); // Esterno cliccabile
    drawHexagon("interno", internoPoints, colors, true); // Interno cliccabile
});


