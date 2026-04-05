const URL = "http://localhost:3000/students";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJEaXJldG9yIiwicm9sZSI6ImRpcmV0b3IiLCJpYXQiOjE3NzU0MTMzMDksImV4cCI6MTc3NTQ5OTcwOX0.BcWo1ruZWaDkv68a3wTcyacHqmhljTtcCnMzRZD8gbc";

async function enviarRequisicoes() {
  let cpfBase = 45672328910;

  for (let i = 1; i <= 100; i++) {
    const payload = {
      nome: `Maria Silva Cardoso${i}`,
      cpf: String(cpfBase + i),
      dataNascimento: "2005-03-15",
      dataIngresso: "2025-02-01",
      dataDesligamento: "2025-12-31",
      status: "Ativo",
      observacaoBreve: "Aluno dedicado",
      observacaoDetalhada: "Mostra interesse em programação...",
      telefone: "11999887766",
      email: `maria2${i}@example.com`,
      endereco: "Rua das Flores, 123",
      nomeResponsavel: "Ana Silva",
      telefoneResponsavel: "11988776655",
      usaMedicamento: false,
      infoMedicamentos: "Ritalina 10mg",
      acompanhamento: {
        av1: false,
        av2: false,
        entrevista1: false,
        entrevista2: false,
        resultado: "Pendente"
      }
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

      console.log(`✅ ${i} enviado - status: ${response.status}`);
    } catch (error) {
      console.error(`❌ Erro no ${i}:`, error.message);
    }
  }
}

enviarRequisicoes();