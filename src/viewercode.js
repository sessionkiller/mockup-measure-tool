const togglePDFInteractions = () => {
  const iframe = document.getElementById("inlineFrameExample");
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  const toolbar = iframeDocument.getElementById("toolbarContainer");
  const viewerContainer = iframe.contentWindow.document.getElementById("viewerContainer");
  const pdfInteractionsButton = document.getElementById("pdfInteractionsButton");

  if (toolbar) {
    toolbar.style.pointerEvents = toolbar.style.pointerEvents === "none" ? "auto" : "none";
  }

  if (viewerContainer) {
    viewerContainer.style.overflow = viewerContainer.style.overflow === "hidden" ? "auto" : "hidden";
  }

  if (pdfInteractionsButton) {
    pdfInteractionsButton.textContent = pdfInteractionsButton.textContent === "Desactivar Medición" ? "Activar Medición" : "Desactivar Medición";
  }
};
