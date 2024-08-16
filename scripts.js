// Room rates object
const roomRates = {
  Standard: 20600,
  Deluxe: 25600,
  Executive: 30600,
};

// Function to calculate total cost
function calculateTotalCost() {
  const numberOfNights = document.getElementById(
    "number-of-nights-value"
  ).textContent;
  const numberOfRooms = document.getElementById("number-of-rooms").value;
  const roomType = document.getElementById("room-type").value;

  const roomRate = roomRates[roomType] || 0;
  const totalCost =
    (parseInt(numberOfRooms) || 0) *
    (parseInt(roomRate) || 0) *
    (parseInt(numberOfNights) || 0);

  document.getElementById("total-cost-value").textContent = totalCost;
}

// Function to recalculate remaining amount
function calculateRemainingAmount() {
  const discountedAmount = document.getElementById("discount-amount").value;
  const advanceAmount = document.getElementById("advance-amount").value;
  const remainingAmount =
    (parseInt(discountedAmount) || 0) - (parseInt(advanceAmount) || 0);

  document.getElementById("remaning-cost").textContent = remainingAmount;
}

// Function to modify HTML content
function modifyHtmlContent(htmlContent) {
  const doc = new DOMParser().parseFromString(htmlContent, "text/html");

  const reservationNumber = document.getElementById("reservation-number").value;
  const arrivalDate = document.getElementById("arrival-date").value;
  const departureDate = document.getElementById("departure-date").value;
  const numberOfNights = document.getElementById(
    "number-of-nights-value"
  ).textContent;
  const numberOfRooms = document.getElementById("number-of-rooms").value;
  const guestName = document.getElementById("guest-name").value;
  const phoneNumber = document.getElementById("phone-number").value;
  const roomType = document.getElementById("room-type").value;
  const discountedAmount = document.getElementById("discount-amount").value;
  const advanceAmount = document.getElementById("advance-amount").value;
  const totalCost = document.getElementById("total-cost-value").textContent;
  // Get room rate based on room type, default to 0 if room type not found
  const roomRate = roomRates[roomType] || 0;

  // Replace text content of template with form data
  doc.getElementById("reservation-number").textContent = reservationNumber;
  doc.getElementById("arrival-date").textContent = arrivalDate;
  doc.getElementById("departure-date").textContent = departureDate;
  doc.getElementById("number-of-nights-value").textContent = numberOfNights;
  doc.getElementById("guest-name-1").textContent = guestName;
  doc.getElementById("guest-name-2").textContent = guestName;
  doc.getElementById("phone-number").textContent = phoneNumber;
  doc.getElementById("discount-amount").textContent = discountedAmount;
  doc.getElementById("advance-amount").textContent = advanceAmount;
  doc.getElementById("total-cost-value").textContent = totalCost;

  // Set room counts based on room type
  if (roomType === "Standard") {
    doc.getElementById("standard-deluxe-rooms-count").textContent =
      numberOfRooms;
  } else if (roomType === "Deluxe") {
    doc.getElementById("deluxe-rooms-count").textContent = numberOfRooms;
  } else if (roomType === "Executive") {
    doc.getElementById("executive-rooms-count").textContent = numberOfRooms;
  }

  return doc.documentElement.outerHTML;
}

// Function to handle PDF Download
function handleSubmit(event) {
  event.preventDefault();

  // Recalculate all relevant values before generating PDF
  calculateNumberOfNights();
  calculateTotalCost();
  calculateRemainingAmount();

  // Get the PDF template container and guest name
  const pdfTemplateContainer = document.querySelector(
    ".pdf-template-container"
  );
  const guestName = document.getElementById("guest-name").value;
  const reservationNumber = document.getElementById("reservation-number").value;
  // Update the HTML content with the latest form data
  const pdfTemplate = document.querySelector("#pdf-template");
  pdfTemplate.innerHTML = modifyHtmlContent(pdfTemplate.innerHTML);

  // Show the PDF template container
  pdfTemplateContainer.style.display = "block";

  window.jsPDF = window.jspdf.jsPDF;
  window.html2canvas = html2canvas;

  // Use html2canvas to capture the element as a canvas
  html2canvas(pdfTemplate, {
    allowTaint: false,
    useCORS: true,
    scale: 3,
  })
    .then((canvas) => {
      // Create a new jsPDF instance
      let pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions to fit the whole canvas onto PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the captured canvas image to the PDF
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Hide the PDF template container
      pdfTemplateContainer.style.display = "none";

      // Save PDF to a file and download
      pdf.save(`${guestName}_${reservationNumber}_reservation.pdf`);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
      pdfTemplateContainer.style.display = "none";
    });
}

// Function to handle view PDF
function handleView(event) {
  event.preventDefault();

  // Recalculate all relevant values before displaying PDF
  calculateNumberOfNights();
  calculateTotalCost();
  calculateRemainingAmount();

  // Get the PDF template container and close button
  const pdfTemplateContainer = document.querySelector(
    ".pdf-template-container"
  );
  const closeButton = document.querySelector(".close-button");

  // Update the HTML content with the latest form data
  const pdfTemplate = document.querySelector("#pdf-template");
  pdfTemplate.innerHTML = modifyHtmlContent(pdfTemplate.innerHTML);

  // Show the PDF template container and close button
  closeButton.style.display = "block";
  pdfTemplateContainer.style.display = "block";
}

// Function to handle close PDF
function handleClosePDF(event) {
  event.preventDefault();
  const pdfTemplateContainer = document.querySelector(
    ".pdf-template-container"
  );
  const closeButton = document.querySelector(".close-button");
  closeButton.style.display = "none";
  pdfTemplateContainer.style.display = "none";
}

// Function to calculate number of nights
function calculateNumberOfNights() {
  const arrivalDateInput = document.getElementById("arrival-date");
  const departureDateInput = document.getElementById("departure-date");
  const numberOfNightsText = document.getElementById("number-of-nights-value");

  const arrivalDate = new Date(arrivalDateInput.value);
  const departureDate = new Date(departureDateInput.value);

  const timeDifference = departureDate.getTime() - arrivalDate.getTime();
  const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

  numberOfNightsText.textContent = numberOfNights > 0 ? numberOfNights : 0;
}

// Event listeners to recalculate values when form inputs change
document
  .getElementById("number-of-rooms")
  .addEventListener("change", calculateTotalCost);
document
  .getElementById("room-type")
  .addEventListener("change", calculateTotalCost);
document
  .getElementById("arrival-date")
  .addEventListener("change", calculateNumberOfNights);
document
  .getElementById("departure-date")
  .addEventListener("change", calculateNumberOfNights);
document
  .getElementById("discount-amount")
  .addEventListener("input", calculateRemainingAmount);
document
  .getElementById("advance-amount")
  .addEventListener("input", calculateRemainingAmount);

// Form submit event listener
document.querySelector("form").addEventListener("submit", handleSubmit);
