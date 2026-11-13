/** UAE mobile numbers: 9 digits, typically 50/52/54/55/56/58… */
const UAE_LOCAL_REGEX = /^5[024568]\d{7}$/;

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

/** Normalize input to 9-digit local UAE mobile or null */
function parseUaeLocalNumber(input) {
  let d = digitsOnly(input);
  if (d.startsWith("971")) {
    d = d.slice(3, 12);
  } else if (d.startsWith("00971")) {
    d = d.slice(5, 14);
  } else if (d.startsWith("0") && d.length === 10) {
    d = d.slice(1);
  }
  if (d.length > 9) d = d.slice(0, 9);
  return d.length === 9 && UAE_LOCAL_REGEX.test(d) ? d : null;
}

function formatUaeLocalDisplay(nineDigits) {
  return `${nineDigits.slice(0, 2)} ${nineDigits.slice(2, 5)} ${nineDigits.slice(5)}`;
}

function formatUaeInternational(nineDigits) {
  return `+971 ${formatUaeLocalDisplay(nineDigits)}`;
}

function isValidUaePhone(input) {
  return parseUaeLocalNumber(input) !== null;
}

function bindUaePhoneInput(input) {
  if (!input) return;

  input.addEventListener("input", () => {
    let d = digitsOnly(input.value);
    if (d.startsWith("971")) d = d.slice(3);
    d = d.slice(0, 9);
    if (d.length > 5) {
      input.value = `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    } else if (d.length > 2) {
      input.value = `${d.slice(0, 2)} ${d.slice(2)}`;
    } else {
      input.value = d;
    }
  });

  input.addEventListener("blur", () => {
    const local = parseUaeLocalNumber(input.value);
    if (local) input.value = formatUaeLocalDisplay(local);
  });
}

function setUaePhoneInputValue(input, stored) {
  if (!input || !stored) return;
  const local = parseUaeLocalNumber(stored) || digitsOnly(stored).slice(-9);
  if (local && UAE_LOCAL_REGEX.test(local)) {
    input.value = formatUaeLocalDisplay(local);
  } else {
    input.value = stored;
  }
}
