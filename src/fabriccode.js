// VARIABLES GLOBALES
let isDrawing = false;
let isEditionModeEnabled = false;
let isScaleMeasureEnabled = false;
let startX,
  startY,
  tempLine,
  tempText,
  linePxSize,
  scaleInMeters,
  scaleInPixels;

// ELEMENTOS HTML
const editionButton = document.getElementById("edition");
const enterScaleButton = document.getElementById("scale");
const scaleMenu = document.getElementById("scaleMenu");
const scaleInput = document.getElementById("scaleInput");
const scaleButton = document.getElementById("scaleButton");

enterScaleButton.addEventListener("click", function () {
  if (scaleMenu.style.display === "none" || scaleMenu.style.display === "") {
    scaleInMeters = null;
    scaleInPixels = null;
    scaleInput.value = "";
    showScaleMeasurementMenu();
  } else {
    hideScaleMeasurementMenu();
  }
  clearCanvas();
});

// TODO - Mover estas funciones a la parte de abajo

const showScaleMeasurementMenu = () => {
  scaleMenu.style.display = "block";
  isScaleMeasureEnabled = true;
};

const hideScaleMeasurementMenu = () => {
  scaleMenu.style.display = "none";
  isScaleMeasureEnabled = false;
};

// CANVAS
const canvas = new fabric.Canvas("measurement", {
  backgroundColor: "#f0f0f0",
  selection: false,
  width: 1200,
  height: 400,
});

// AÑADIR ELEMENTOS AL NAVBAR
editionButton.addEventListener("click", function () {
  if (isEditionModeEnabled) {
    alert("Edition disabled!");
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    clearCanvas();
    editionButton.textContent = "Enable Edition";
  } else {
    alert("Events enabled!");
    editionButton.textContent = "Disable Edition";
    enableMouseDownEvent();
    enableMouseMoveEvent();
  }
  isEditionModeEnabled = !isEditionModeEnabled;
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
      const endPoint = createPoint(pointer.x, pointer.y);
      canvas.add(endPoint);
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
    const line = addLine(startX, startY, pointer.x, pointer.y);
    tempLine = line.line;
    tempText = line.text;
  });
};

// MÉTODOS DE CREACIÓN DE FIGURAS
const createPoint = (startX, startY) => {
  return new fabric.Circle({
    left: startX - 5,
    top: startY - 5,
    radius: 5,
    fill: isScaleMeasureEnabled ? "red" : "blue",
    selectable: false,
    evented: false,
  });
};

function addLine(x1, y1, x2, y2) {
  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: isScaleMeasureEnabled ? "red" : "blue",
    selectable: false,
    evented: false,
  });
  line.sendToBack();

  let textToPrint =
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2) + " px";
  if (isScaleMeasureEnabled) {
    scaleInPixels = Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    ).toFixed(2);
  }
  if (scaleInMeters) {
    textToPrint =
      pixelsToMeters(
        parseFloat(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)))
      ) + " m";
  }
  const text = new fabric.Text(textToPrint, {
    left: (x1 + x2) / 2,
    top: (y1 + y2) / 2,
    fontSize: 14,
    fill: "red",
    selectable: false,
    evented: false,
  });

  canvas.add(line, text);
  return { line: line, text: text };
}

const clearCanvas = () => {
  canvas.clear();
  canvas.setBackgroundColor("#f0f0f0", canvas.renderAll.bind(canvas));
  setBackgroundImage();
};

// CUANDO SE CARGA LA PÁGINA
window.onload = function () {
  setBackgroundImage();
};

function handleFormSubmit(e) {
  e.preventDefault();
  scaleInMeters = document.getElementById("scaleInput").valueAsNumber;
  hideScaleMeasurementMenu();
  clearCanvas();
}

// UTILIDADES
const pixelsToMeters = (pixels) => {
  if (scaleInPixels && scaleInMeters) {
    return ((pixels / scaleInPixels) * scaleInMeters).toFixed(3);
  } else {
    return null;
  }
};

// VALIDACIONES DEL FORMULARIO
const validateForm = () => {
  const scaleValue = scaleInput.value.trim();
  const hasObjects = canvas.getObjects().length > 0;
  scaleButton.disabled = !(scaleValue && hasObjects);
};

scaleInput.addEventListener("input", validateForm);
canvas.on("object:added", validateForm);
canvas.on("object:removed", validateForm);

const setBackgroundImage = () => {
  fabric.Image.fromURL("/casa-para-pintar.jpg", function (img) {
    canvas.setWidth(img.width);
    canvas.setHeight(img.height);
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height,
    });
  });
};
