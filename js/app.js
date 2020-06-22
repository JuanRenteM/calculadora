const pantalla = document.querySelector(".pantalla");
const display = document.querySelector("#display");
const keys = document.querySelectorAll(".tecla");

let reset = true;
let currentOperator;

// Functions
function handleKeyClick(e) {
  const { type, value } = e.target.dataset;

  switch (type) {
    case "number":
      handleNumber(value);
      break;
    case "operator":
      handleOperator(value);
      break;
    case "sign":
      handleSign(value);
      break;
    case "on":
      handleOn();
      break;
  }
}

function handleNumber(value) {
  if (reset) {
    display.innerHTML = "";
    reset = false;
  }

  display.innerHTML += value;
  scrollToEnd();
  currentOperator = undefined;
}

function handleOperator(value) {
  if (reset && value === "root") {
    display.innerHTML = "√ ";
    reset = false;
    return;
  }

  // valida que no se puedan colocar 2 operadores consecutivos
  if (currentOperator !== undefined && value !== "root") {
    return;
  }

  // Valida que la raíz cuadrada esté precedida por un operador
  if (currentOperator === undefined && value === "root") {
    return;
  }

  display.innerHTML += {
    root: " √ ",
    divide: " ÷ ",
    multiply: " * ",
    substract: " - ",
    add: " + ",
  }[value];

  currentOperator = value;

  scrollToEnd();
}

function handleSign(value) {
  let expression = display.innerHTML;

  // Sanitiza la expresión para que sea válida al momento de evaluar
  expression = expression
    .replace(/(√ \w.+)/g, (v) => v.replace(/[\d.]+/g, (n) => `Math.sqrt(${n})`))
    .replace(/√/g, "")
    .replace(/÷/g, "/")
    .replace(/ /g, " ");

  switch (value) {
    case "=":
      console.log(expression);
      display.innerHTML = eval(expression);
      scrollToStart();
      break;
    default:
      const values = display.innerHTML.split(" ");
      let currentValue = values[values.length - 1];

      if (value === ".") {
        // Agrega un punto a la expresión y valida que no haya más de uno
        if ((currentValue.match(/\./g) || []).length === 0) {
          display.innerHTML += value;
        }
      } else if (value === "sign") {
        // Cambia el signo
        values[values.length - 1] = `${parseInt(currentValue) * -1}`;
        display.innerHTML = values.join(" ");
      }

      scrollToEnd();
  }
}

function handleOn() {
  display.innerHTML = "0";
  reset = true;
}

function scrollToStart() {
  pantalla.scrollLeft = 0;
}

function scrollToEnd() {
  pantalla.scrollBy(pantalla.offsetWidth, 0);
}

// Events
window.onload = () => {
  keys.forEach((t) => t.addEventListener("click", handleKeyClick));
};
