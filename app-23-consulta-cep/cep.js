export function onlyDigits(text) {
  return String(text || "").replace(/\D/g, "").slice(0, 8);
}

export function formatCep(text) {
  const d = onlyDigits(text);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export async function fetchCep(digits) {
  if (digits.length !== 8) {
    throw new Error("CEP inválido. Digite os 8 números do CEP.");
  }
  let response;
  try {
    response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  } catch {
    throw new Error("Não foi possível conectar ao ViaCEP. Verifique sua internet.");
  }
  if (!response.ok) {
    throw new Error("CEP inválido. Confira os números digitados.");
  }
  const data = await response.json();
  if (data.erro === true || data.erro === "true") {
    throw new Error("CEP não encontrado. Confira os números e tente novamente.");
  }
  return data;
}
