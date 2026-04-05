const URL = "http://localhost:3000/placements"; // ajuste a rota real
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJEaXJldG9yIiwicm9sZSI6ImRpcmV0b3IiLCJpYXQiOjE3NzU0MTMzMDksImV4cCI6MTc3NTQ5OTcwOX0.BcWo1ruZWaDkv68a3wTcyacHqmhljTtcCnMzRZD8gbc";

async function enviarVinculos() {
  const empresaId = 7;
  const createdBy = 3;

  for (let i = 1; i <= 100; i++) {
    const payload = {
      studentId: i, // incrementa o studentId
      empresaId: empresaId,
      dataAdmissao: "2025-03-01",
      funcao: `Auxiliar Administrativo ${i}`, // opcional: variar função
      contatoRh: `Carolina - rh${i}@empresa.com`, // opcional: variar email
      dataDesligamento: "2025-12-31",
      dataProvavelDesligamento: "2025-11-30",
      observacoes: `Bom desempenho ${i}`,
      status: "Ativo",
      createdBy: createdBy
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
      console.log(`✅ studentId ${payload.studentId} enviado - status: ${response.status}`);
    } catch (error) {
      console.error(`❌ Erro no studentId ${payload.studentId}:`, error.message);
    }
  }
}

enviarVinculos();