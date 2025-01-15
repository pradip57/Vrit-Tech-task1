const mainDiv = document.querySelector(".mainDiv");
const boxDivs = Array.from(document.querySelectorAll(".boxDiv"));

let isDragging = false;
let startY = 0;
let currentOffset = 0;
const gap = 40; // Gap between the divs
const visibleDivsCount = 3; // Show 3 divs at once

// Initialize positions for 3 boxDivs
function initializePositions() {
  const mainHeight = mainDiv.offsetHeight;
  const boxHeight = boxDivs[0].offsetHeight;
  const totalDivs = visibleDivsCount; // Display only 3 divs at once

  // Total height of all the divs + gaps
  const totalHeight = totalDivs * boxHeight + (totalDivs - 1) * gap;

  // Calculate the available space in the main div
  const availableSpace = mainHeight - totalHeight;
  const startPosition = availableSpace / 2; // Position the divs starting from the center

  let topPosition = startPosition; // Start placing the divs at the center of the container

  boxDivs.forEach((box, index) => {
    box.style.position = "absolute";
    box.style.left = "50%"; // Center horizontally
    box.style.transform = "translateX(-50%)"; // Center the div horizontally

    // Position each box with equal gaps
    box.style.top = `${topPosition}px`;

    // Update the top position for the next div
    topPosition += boxHeight + gap; // 20px is the gap between divs

    // Apply the scaling logic: center box is bigger, top and bottom are smaller
    updateBoxSize(box);
  });
}

// Handle mousedown to start dragging
mainDiv.addEventListener("mousedown", (e) => {
  isDragging = true;
  startY = e.clientY;
  currentOffset = 0;
  mainDiv.style.cursor = "grabbing";
});

// Handle mouseup to stop dragging
document.addEventListener("mouseup", () => {
  isDragging = false;
  mainDiv.style.cursor = "default";
  adjustBoxPositions(); // Snap boxes to new positions
});

// Handle mousemove for dragging
mainDiv.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const deltaY = e.clientY - startY;
  currentOffset += deltaY;
  updateBoxPositions(deltaY);
  startY = e.clientY;
});

// Update box positions during dragging
function updateBoxPositions(deltaY) {
  boxDivs.forEach((box) => {
    const currentTop = parseFloat(box.style.top);
    box.style.top = `${currentTop + deltaY}px`; // Update vertical position
    updateBoxSize(box); // Dynamically update size based on position
  });
}

// Update the size of a box based on its position
function updateBoxSize(box) {
  const mainHeight = mainDiv.offsetHeight;
  const boxHeight = box.offsetHeight;
  const topPosition = parseFloat(box.style.top);

  const centerPosition = (mainHeight - boxHeight) / 2;
  const distanceFromCenter = Math.abs(topPosition - centerPosition);

  // Scale based on proximity to the center
  const maxScale = 1.2; // Scale for the center box
  const minScale = 0.9; // Scale for other boxes
  const scaleFactor = Math.max(
    minScale,
    maxScale - (distanceFromCenter / mainHeight) * 0.6
  );

  box.style.transform = `translateX(-50%) scale(${scaleFactor})`;
}

// Adjust the divs' positions after dragging
function adjustBoxPositions() {
  const mainHeight = mainDiv.offsetHeight;
  const boxHeight = boxDivs[0].offsetHeight;
  const totalDivs = visibleDivsCount;

  // Recalculate the available space and start position for consistent gaps
  const totalHeight = totalDivs * boxHeight + (totalDivs - 1) * gap;
  const availableSpace = mainHeight - totalHeight;
  let topPosition = availableSpace / 2;

  boxDivs.forEach((box) => {
    let top = parseFloat(box.style.top);

    // Move box to the bottom if it goes above the view
    if (top + boxHeight < 0) {
      top += boxHeight * totalDivs + gap * totalDivs;
    }

    // Move box to the top if it goes below the view
    if (top >= mainHeight) {
      top -= boxHeight * totalDivs + gap * totalDivs;
    }

    box.style.top = `${top}px`;
  });

  // Reorder the boxes in the DOM to maintain logical order
  boxDivs.sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top));

  // Maintain equal gaps after reordering
  boxDivs.forEach((box, index) => {
    const newTop = availableSpace / 2 + index * (boxHeight + gap);
    box.style.top = `${newTop}px`;
    updateBoxSize(box); // Update sizes after adjustment
  });
}

initializePositions();
