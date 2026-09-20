export function createCalc() {
  return {
    display: "0",
    acc: null,
    op: null,
    fresh: true,
  };
}

function format(n) {
  if (!Number.isFinite(n)) return "Erro";
  if (Object.is(n, -0)) return "0";
  const rounded = Number(n.toPrecision(12));
  if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-8)) {
    return rounded.toExponential(6).replace(/\.?0+e/, "e");
  }
  return String(rounded);
}

function compute(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? NaN : a / b;
  return b;
}

export function inputDigit(state, digit) {
  if (state.display === "Erro") return { ...createCalc(), display: digit, fresh: false };
  if (state.fresh || state.display === "0") {
    return { ...state, display: digit, fresh: false };
  }
  const digits = state.display.replace("-", "").replace(".", "");
  if (digits.length >= 12) return state;
  return { ...state, display: state.display + digit };
}

export function inputDot(state) {
  if (state.display === "Erro") return { ...createCalc(), display: "0.", fresh: false };
  if (state.fresh) return { ...state, display: "0.", fresh: false };
  if (state.display.includes(".")) return state;
  return { ...state, display: state.display + "." };
}

export function applyOp(state, nextOp) {
  if (state.display === "Erro") return createCalc();
  const value = Number(state.display);
  if (state.op && !state.fresh) {
    const result = compute(state.acc, state.op, value);
    if (!Number.isFinite(result)) {
      return { display: "Erro", acc: null, op: null, fresh: true };
    }
    return { display: format(result), acc: result, op: nextOp, fresh: true };
  }
  return { ...state, acc: value, op: nextOp, fresh: true };
}

export function equals(state) {
  if (state.op === null || state.acc === null) return state;
  const result = compute(state.acc, state.op, Number(state.display));
  if (!Number.isFinite(result)) {
    return { display: "Erro", acc: null, op: null, fresh: true };
  }
  return { display: format(result), acc: null, op: null, fresh: true };
}

export function clear() {
  return createCalc();
}

export function backspace(state) {
  if (state.display === "Erro") return createCalc();
  if (state.fresh) return state;
  if (state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith("-"))) {
    return { ...state, display: "0", fresh: true };
  }
  return { ...state, display: state.display.slice(0, -1) };
}

export function percent(state) {
  if (state.display === "Erro") return createCalc();
  return { ...state, display: format(Number(state.display) / 100), fresh: true };
}

export function toggleSign(state) {
  if (state.display === "0" || state.display === "Erro") return state;
  if (state.display.startsWith("-")) {
    return { ...state, display: state.display.slice(1) };
  }
  return { ...state, display: `-${state.display}` };
}

export function expressionLabel(state) {
  if (state.op === null || state.acc === null) return "";
  const symbol = { "+": "+", "-": "−", "*": "×", "/": "÷" }[state.op];
  return `${format(state.acc)} ${symbol}`;
}
