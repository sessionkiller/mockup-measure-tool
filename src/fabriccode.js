// VARIABLES GLOBALES
let isDrawing = false;
let startX, startY;
let tempLine, tempText;
let eventsEnabled = true;

// ELEMENTOS HTML
const button = document.getElementById("edition");
const scaleButton = document.getElementById("scale");
const scaleMenu = document.getElementById("scaleMenu");

scaleButton.addEventListener("click", function () {
    if (scaleMenu.style.display === "none" || scaleMenu.style.display === "") {
        scaleMenu.style.display = "block";
    } else {
        scaleMenu.style.display = "none";
    }
});

// AÑADIR ELEMENTOS AL NAVBAR
button.addEventListener("click", function () {
  if (eventsEnabled) {
    alert("Edition disabled!");
    canvas.off("mouse:down");
    canvas.off("mouse:move");
  } else {
    alert("Events enabled!");
    canvas.on("mouse:down", function (o) {
      const pointer = canvas.getPointer(o.e);
      if (!isDrawing) {
        isDrawing = true;
        startX = pointer.x;
        startY = pointer.y;
        const startPoint = createPoint(pointer.x, pointer.y);
        canvas.add(startPoint);
      } else {
        isDrawing = false;
        canvas.remove(tempLine, tempText);
        addLine(startX, startY, pointer.x, pointer.y);
      }
    });

    canvas.on("mouse:move", function (o) {
      if (!isDrawing) return;

      const pointer = canvas.getPointer(o.e);
      if (tempLine) {
        canvas.remove(tempLine, tempText);
      }

      tempLine = new fabric.Line([startX, startY, pointer.x, pointer.y], {
        stroke: "black",
        selectable: false,
        evented: false,
      });

      const length = Math.sqrt(
        Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
      ).toFixed(2);
      tempText = new fabric.Text(length + " px", {
        left: (startX + pointer.x) / 2,
        top: (startY + pointer.y) / 2,
        fontSize: 14,
        fill: "red",
        selectable: false,
        evented: false,
      });

      canvas.add(tempLine, tempText);
      canvas.renderAll();
    });
  }
  eventsEnabled = !eventsEnabled;
});

document.getElementById("clear").addEventListener("click", function () {
  canvas.clear();
  canvas.setBackgroundColor("#f0f0f0", canvas.renderAll.bind(canvas));
});

// CANVAS

const canvas = new fabric.Canvas("measurement", {
  backgroundColor: "#f0f0f0",
  selection: false,
  width: 1200,
  height: 400,
});

// EVENTOS DE MOUSE

canvas.on("mouse:down", function (o) {
  const pointer = canvas.getPointer(o.e);
  if (!isDrawing) {
    isDrawing = true;
    startX = pointer.x;
    startY = pointer.y;
    const startPoint = createPoint(startX, startY);
    canvas.add(startPoint);
  } else {
    isDrawing = false;
    canvas.remove(tempLine, tempText);
    addLine(startX, startY, pointer.x, pointer.y);
  }
});

canvas.on("mouse:move", function (o) {
  if (!isDrawing) return;

  const pointer = canvas.getPointer(o.e);
  if (tempLine) {
    canvas.remove(tempLine, tempText);
  }

  tempLine = new fabric.Line([startX, startY, pointer.x, pointer.y], {
    stroke: "black",
    selectable: false,
    evented: false,
  });

  const length = Math.sqrt(
    Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
  ).toFixed(2);
  tempText = new fabric.Text(length + " px", {
    left: (startX + pointer.x) / 2,
    top: (startY + pointer.y) / 2,
    fontSize: 14,
    fill: "red",
    selectable: false,
    evented: false,
  });

  canvas.add(tempLine, tempText);
  canvas.renderAll();
});

// MÉTODOS DE CREACIÓN DE FIGURAS
const createPoint = (startX, startY) => {
  console.log("createPoint");
  return new fabric.Circle({
    left: startX - 5,
    top: startY - 5,
    radius: 5,
    fill: "blue",
    selectable: false,
    evented: false,
  });
};

function addLine(x1, y1, x2, y2) {
const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: "black",
    selectable: false,
    evented: false,
});
line.sendToBack();

  const endPoint = createPoint(x2, y2);

  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(
    2
  );
  const text = new fabric.Text(length + " px", {
    left: (x1 + x2) / 2,
    top: (y1 + y2) / 2,
    fontSize: 14,
    fill: "red",
    selectable: false,
    evented: false,
  });

  canvas.add(line, endPoint, text);
}
