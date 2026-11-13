/** Qatar local numbers: 8 digits starting with 3–7 */
const QATAR_LOCAL_REGEX = /^[34567]\d{7}$/;

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function parseQatarLocalNumber(input) {
  let d = digitsOnly(input);
  if (d.startsWith("974") && d.length >= 11) {
    d = d.slice(3, 11);
  } else if (d.startsWith("0974")) {
    d = d.slice(4, 12);
  } else if (d.startsWith("0") && d.length === 9) {
    d = d.slice(1);
  }
  if (d.length > 8) d = d.slice(0, 8);
  return d.length === 8 && QATAR_LOCAL_REGEX.test(d) ? d : null;
}

function formatQatarLocalDisplay(eightDigits) {
  return `${eightDigits.slice(0, 4)} ${eightDigits.slice(4)}`;
}

function formatQatarInternational(eightDigits) {
  return `+974 ${formatQatarLocalDisplay(eightDigits)}`;
}

function isValidQatarPhone(input) {
  return parseQatarLocalNumber(input) !== null;
}

function bindQatarPhoneInput(input) {
  if (!input) return;

  input.addEventListener("input", () => {
    let d = digitsOnly(input.value);
    if (d.startsWith("974")) d = d.slice(3);
    d = d.slice(0, 8);
    input.value = d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d;
  });

  input.addEventListener("blur", () => {
    const local = parseQatarLocalNumber(input.value);
    if (local) input.value = formatQatarLocalDisplay(local);
  });
}

function setQatarPhoneInputValue(input, stored) {
  if (!input || !stored) return;
  const local = parseQatarLocalNumber(stored) || digitsOnly(stored).slice(-8);
  if (local && QATAR_LOCAL_REGEX.test(local)) {
    input.value = formatQatarLocalDisplay(local);
  } else {
    input.value = stored;
  }
}
