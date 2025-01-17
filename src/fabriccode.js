const canvas = new fabric.Canvas('measurement', {
    backgroundColor: '#f0f0f0',
    selection: false,
    width: 1200,
    height: 400
});

function addLine(x1, y1, x2, y2) {
    console.log("Pasa por el addline");
    const line = new fabric.Line([x1, y1, x2, y2], {
        stroke: 'black',
        selectable: false,
        evented: false
    });

    const endPoint = new fabric.Circle({
        left: x2 - 5,
        top: y2 - 5,
        radius: 5,
        fill: 'blue',
        selectable: false,
        evented: false
    });

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
    const text = new fabric.Text(length + ' px', {
        left: (x1 + x2) / 2,
        top: (y1 + y2) / 2,
        fontSize: 14,
        fill: 'red',
        selectable: false,
        evented: false
    });

    canvas.add(line, endPoint, text);
}

let isDrawing = false;
let startX, startY;

let tempLine, tempText;

canvas.on('mouse:down', function (o) {
    const pointer = canvas.getPointer(o.e);
    if (!isDrawing) {
        isDrawing = true;
        startX = pointer.x;
        startY = pointer.y;
        const startPoint = new fabric.Circle({
            left: startX - 5,
            top: startY - 5,
            radius: 5,
            fill: 'blue',
            selectable: false,
            evented: false
        });
        canvas.add(startPoint);
    } else {
        isDrawing = false;
        canvas.remove(tempLine, tempText);
        addLine(startX, startY, pointer.x, pointer.y);
    }
});

canvas.on('mouse:move', function (o) {
    if (!isDrawing) return;

    const pointer = canvas.getPointer(o.e);
    if (tempLine) {
        canvas.remove(tempLine, tempText);
    }

    tempLine = new fabric.Line([startX, startY, pointer.x, pointer.y], {
        stroke: 'black',
        selectable: false,
        evented: false
    });

    const length = Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)).toFixed(2);
    tempText = new fabric.Text(length + ' px', {
        left: (startX + pointer.x) / 2,
        top: (startY + pointer.y) / 2,
        fontSize: 14,
        fill: 'red',
        selectable: false,
        evented: false
    });

    canvas.add(tempLine, tempText);
    canvas.renderAll();
});

canvas.renderAll();

document.getElementById('clear').addEventListener('click', function () {
    canvas.clear();
    canvas.setBackgroundColor('#f0f0f0', canvas.renderAll.bind(canvas));
});

// DESHABILITAR LA EDICION DEL CANVAS

const navbar = document.getElementById('navbar');
const button = document.createElement('button');
button.innerText = 'Deshabilitar edición';
let eventsEnabled = true;

button.addEventListener('click', function () {
    if (eventsEnabled) {
        alert('Edition disabled!');
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        button.innerText = 'Habilitar edición';
    } else {
        alert('Events enabled!');
        canvas.on('mouse:down', function (o) {
            const pointer = canvas.getPointer(o.e);
            if (!isDrawing) {
                isDrawing = true;
                startX = pointer.x;
                startY = pointer.y;
                const startPoint = new fabric.Circle({
                    left: startX - 5,
                    top: startY - 5,
                    radius: 5,
                    fill: 'blue',
                    selectable: false,
                    evented: false
                });
                canvas.add(startPoint);
            } else {
                isDrawing = false;
                canvas.remove(tempLine, tempText);
                addLine(startX, startY, pointer.x, pointer.y);
            }
        });

        canvas.on('mouse:move', function (o) {
            if (!isDrawing) return;

            const pointer = canvas.getPointer(o.e);
            if (tempLine) {
                canvas.remove(tempLine, tempText);
            }

            tempLine = new fabric.Line([startX, startY, pointer.x, pointer.y], {
                stroke: 'black',
                selectable: false,
                evented: false
            });

            const length = Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)).toFixed(2);
            tempText = new fabric.Text(length + ' px', {
                left: (startX + pointer.x) / 2,
                top: (startY + pointer.y) / 2,
                fontSize: 14,
                fill: 'red',
                selectable: false,
                evented: false
            });

            canvas.add(tempLine, tempText);
            canvas.renderAll();
        });
    }
    eventsEnabled = !eventsEnabled;
});
navbar.appendChild(button);
