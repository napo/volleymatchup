document.addEventListener("DOMContentLoaded", function() {
    var s = Snap("#svg");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };
    var outerHexagonSize = Math.min(width, height) * 0.45;
    var innerHexagonSize = outerHexagonSize * 0.8;
    var rotationAngle = 360 / 6; // Gradi per la rotazione di uno spicchio
    var currentRotation = { outer: 0, inner: 0 }; // Memorizza l'attuale angolo di rotazione per entrambi gli esagoni


    // Funzione per calcolare i punti degli esagoni
    function calculateHexagonPoints(center, size) {
        var points = [];
        for (var i = 0; i < 6; i++) {
            var angle = Math.PI / 3 * i;
            points.push([
                center.x + size * Math.cos(angle),
                center.y + size * Math.sin(angle)
            ]);
        }
        return points;
    }
    
    // Funzione per disegnare, colorare gli spicchi, e aggiungere dettagli
    function drawAndDecorateHexagon(points, colors, isInner) {
        var group = s.group(); // Crea un gruppo per gli spicchi, linee, e testi
        points.forEach((point, i) => {
            var nextIndex = (i + 1) % 6;
            var midPoint = [(point[0] + points[nextIndex][0]) / 2, (point[1] + points[nextIndex][1]) / 2];
            var pathString = `M${center.x},${center.y} L${point.join(",")} L${points[nextIndex].join(",")} Z`;
            var spicchio = s.path(pathString).attr({
                fill: colors[i],
                stroke: "#000",
                strokeWidth: 1
            });
            group.add(spicchio);

            // Calcola le posizioni per "B" e "R" in base se è interno o esterno
            var offsetDirection = isInner ? 0.1 : -0.1; // Direzione dell'offset per il testo
            var textOffset = isInner ? innerHexagonSize * 0.5 : outerHexagonSize * 0.85; // Distanza dal centro
            var textAngle = Math.PI / 3 * i + Math.PI / 6; // Angolo per posizionare il testo
            var textPosB = [center.x + textOffset * Math.cos(textAngle + offsetDirection), center.y + textOffset * Math.sin(textAngle + offsetDirection)];
            var textPosR = [center.x + textOffset * Math.cos(textAngle - offsetDirection), center.y + textOffset * Math.sin(textAngle - offsetDirection)];

            var textB = s.text(textPosB[0], textPosB[1], `B${i+1}`).attr({ fontSize: '16px', textAnchor: 'middle' });
            var textR = s.text(textPosR[0], textPosR[1], `R${i+1}`).attr({ fontSize: '16px', textAnchor: 'middle' });
            group.add(textB);
            group.add(textR);
        });

        // Gestione della rotazione al clic
        //group.click(function() {
        //    var rotation = isInner ? currentRotation.inner += rotationAngle : currentRotation.outer += rotationAngle;
        //    group.animate({ transform: `r${rotation},${center.x},${center.y}` }, 1000);
        //});
        
                // Rotazione al clic
        group.click(function() {
            group.animate({transform: `r60,${center.x},${center.y}`}, 1000);
        });
    }    
    

    let outerPoints = calculateHexagonPoints(center, outerHexagonSize);
    drawHexagon(outerPoints, colors, outerHexagonSize * 0.9);

    let innerPoints = calculateHexagonPoints(center, innerHexagonSize);
    drawHexagon(innerPoints, colors, innerHexagonSize * 0.7);
  
   
});

