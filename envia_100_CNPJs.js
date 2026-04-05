const URL = "http://localhost:3000/companies"; // ajuste se necessário
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJEaXJldG9yIiwicm9sZSI6ImRpcmV0b3IiLCJpYXQiOjE3NzU0MTMzMDksImV4cCI6MTc3NTQ5OTcwOX0.BcWo1ruZWaDkv68a3wTcyacHqmhljTtcCnMzRZD8gbc";

// Função para calcular dígitos verificadores do CNPJ
function calcularDigitos(cnpjBase) {
  const calc = (base, pesos) => {
    const soma = base
      .split("")
      .reduce((acc, num, i) => acc + Number(num) * pesos[i], 0);

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const pesos2 = [6,...pesos1];

  const d1 = calc(cnpjBase, pesos1);
  const d2 = calc(cnpjBase + d1, pesos2);

  return `${d1}${d2}`;
}

// Gera CNPJ válido a partir de um número sequencial
function gerarCNPJ(index) {
  // base fixa (8 primeiros dígitos) + sequencial de filial (4 dígitos)
  const raiz = "12345678";
  const filial = String(1000 + index).padStart(4, "0"); // varia aqui

  const base = raiz + filial;
  const digitos = calcularDigitos(base);

  return base + digitos;
}

async function enviarEmpresas() {
  for (let i = 1; i <= 100; i++) {
    const payload = {
      nome: `Tech Solutions Ltda${i}`,
      cnpj: gerarCNPJ(i),
      rua: "Rua das Indústrias",
      numero: "500",
      bairro: "Centro",
      estado: "SP",
      cep: "01001000",
      nomeFantasia: `TechSol${i}`,
      razaoSocial: `Tech Solutions Ltda ME ${i}`,
      telefone: "1133445566",
      contatoRhNome: "Carolina Mendes",
      contatoRhEmail: `rh${i}@techsol.com.br`,
      ativo: true
    };

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.log(`✅ ${i} enviado - CNPJ: ${payload.cnpj}`);
    } catch (error) {
      console.error(`❌ Erro no ${i}:`, error.message);
    }
  }
}

enviarEmpresas();