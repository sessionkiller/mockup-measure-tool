// VARIABLES GLOBALES
let isDrawing = false;
let isEventsEnabled = true;
let isScaleMeasureEnabled = false;
let startX, startY, tempLine, tempText, linePxSize, scaleInMeters;

// ELEMENTOS HTML
const editionButton = document.getElementById("edition");
const enterScaleButton = document.getElementById("scale");
const scaleMenu = document.getElementById("scaleMenu");
const scaleInput = document.getElementById("scaleInput");
const scaleSubmitButton = document.getElementById("scaleButton");

enterScaleButton.addEventListener("click", function () {
  if (scaleMenu.style.display === "none" || scaleMenu.style.display === "") {
    scaleMenu.style.display = "block";
    isScaleMeasureEnabled = true;
  } else {
    scaleMenu.style.display = "none";
    isScaleMeasureEnabled = false;
  }
  clearCanvas();
});

// CANVAS
const canvas = new fabric.Canvas("measurement", {
  backgroundColor: "#f0f0f0",
  selection: false,
  width: 1200,
  height: 400,
});

// AÑADIR ELEMENTOS AL NAVBAR
editionButton.addEventListener("click", function () {
  if (isEventsEnabled) {
    alert("Edition disabled!");
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    editionButton.textContent = "Enable Edition";
  } else {
    alert("Events enabled!");
    editionButton.textContent = "Disable Edition";
    enableMouseDownEvent();
    enableMouseMoveEvent();
  }
  isEventsEnabled = !isEventsEnabled;
});

document.getElementById("clear").addEventListener("click", function () {
  clearCanvas();
});

// EVENTOS DE MOUSE
const enableMouseDownEvent = () => {
  canvas.on("mouse:down", function (o) {
    const pointer = canvas.getPointer(o.e);
    if (!isDrawing) {
      const hasObjects = canvas.getObjects().length > 0;
      if (isScaleMeasureEnabled && hasObjects) {
        clearCanvas();
      }
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
};

const enableMouseMoveEvent = () => {
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
};

// MÉTODOS DE CREACIÓN DE FIGURAS
const createPoint = (startX, startY) => {
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

  linePxSize = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(
    2
  );
  const text = new fabric.Text(linePxSize + " px", {
    left: (x1 + x2) / 2,
    top: (y1 + y2) / 2,
    fontSize: 14,
    fill: "red",
    selectable: false,
    evented: false,
  });

  canvas.add(line, endPoint, text);
}

const clearCanvas = () => {
  canvas.clear();
  canvas.setBackgroundColor("#f0f0f0", canvas.renderAll.bind(canvas));
};

// CUANDO SE CARGA LA PÁGINA
window.onload = function () {
  enableMouseDownEvent();
  enableMouseMoveEvent();
};

function handleFormSubmit(e) {
  e.preventDefault();
  scaleInMeters = document.getElementById("scaleInput").valueAsNumber;
  console.log("Scale in meters: ", scaleInMeters);
}
