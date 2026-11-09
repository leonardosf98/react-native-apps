export function validarConta({ nome, idade, sexo, escolaridade }) {
  const erros = {};
  const nomeLimpo = nome.trim();
  if (!nomeLimpo) erros.nome = "Informe o nome completo.";
  else if (nomeLimpo.split(/\s+/).length < 2) erros.nome = "Digite nome e sobrenome.";
  else if (!/^[A-Za-zÀ-ÿ' ]+$/.test(nomeLimpo)) erros.nome = "Use apenas letras.";

  const idadeNumero = Number(idade);
  if (!idade) erros.idade = "Informe a idade.";
  else if (!Number.isInteger(idadeNumero)) erros.idade = "Idade inválida.";
  else if (idadeNumero < 18) erros.idade = "É preciso ter 18 anos ou mais.";
  else if (idadeNumero > 120) erros.idade = "Idade inválida.";

  if (!sexo) erros.sexo = "Selecione uma opção.";
  if (!escolaridade) erros.escolaridade = "Selecione a escolaridade.";
  return erros;
}

export function gerarNumeroConta() {
  const agencia = String(Math.floor(1000 + Math.random() * 9000));
  const conta = String(Math.floor(100000 + Math.random() * 900000));
  const digito = String(Math.floor(Math.random() * 10));
  return { agencia, conta: `${conta}-${digito}` };
}
