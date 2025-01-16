let isDrawing = false;
let line, verticalLineStart, verticalLineEnd;

const canvas = new fabric.Canvas('canvas', {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 'red',
});

canvas.on('mouse:down', function (o) {
    if (!isDrawing) {
        isDrawing = true;
        const pointer = canvas.getPointer(o.e);
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: 'black',
            stroke: 'black',
            originX: 'center',
            originY: 'center'
        });
        verticalLineStart = new fabric.Line([pointer.x, pointer.y - 10, pointer.x, pointer.y + 10], {
            strokeWidth: 2,
            fill: 'blue',
            stroke: 'blue',
            originX: 'center',
            originY: 'center'
        });
        canvas.add(line, verticalLineStart);
    } else {
        isDrawing = false;
        const pointer = canvas.getPointer(o.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        verticalLineEnd = new fabric.Line([pointer.x, pointer.y - 10, pointer.x, pointer.y + 10], {
            strokeWidth: 2,
            fill: 'blue',
            stroke: 'blue',
            originX: 'center',
            originY: 'center'
        });
        canvas.add(verticalLineEnd);
        canvas.renderAll();
    }
});

canvas.on('mouse:move', function (o) {
    if (isDrawing) {
        const pointer = canvas.getPointer(o.e);
        const length = Math.sqrt(Math.pow(pointer.x - line.x1, 2) + Math.pow(pointer.y - line.y1, 2));
        const text = new fabric.Text(length.toFixed(2) + ' px', {
            left: (line.x1 + pointer.x) / 2,
            top: (line.y1 + pointer.y) / 2 - 20,
            fontSize: 14,
            fill: 'black',
            originX: 'center',
            originY: 'center'
        });
        canvas.remove(canvas.getObjects('text').pop());
        canvas.add(text);
    }
    if (!isDrawing) return;
    const pointer = canvas.getPointer(o.e);
    line.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
});

window.addEventListener('resize', () => {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
    canvas.renderAll();
});

canvas.renderAll();
