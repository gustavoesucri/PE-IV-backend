const URL = "http://localhost:3000/assessments";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJEaXJldG9yIiwicm9sZSI6ImRpcmV0b3IiLCJpYXQiOjE3NzU0MTMzMDksImV4cCI6MTc3NTQ5OTcwOX0.BcWo1ruZWaDkv68a3wTcyacHqmhljTtcCnMzRZD8gbc";

function criarPayload(studentId, tipo, index) {
  return {
    studentId,
    entryDate: "2025-02-01",
    assessmentDate: "2025-06-15",
    evaluationType: tipo,
    professorName: "Prof. João Silva",

    q1: "sim", q2: "sim", q3: "nao", q4: "maioria",
    q5: "sim", q6: "nao", q7: "maioria", q8: "sim",
    q9: "nao", q10: "raras", q11: "raras", q12: "nao",
    q13: "raras", q14: "sim", q15: "sim", q16: "sim",
    q17: "nao", q18: "raras", q19: "sim", q20: "sim",
    q21: "sim", q22: "nao", q23: "sim", q24: "nao",
    q25: "sim", q26: "sim", q27: "nao", q28: "nao",
    q29: "sim", q30: "sim", q31: "sim", q32: "sim",
    q33: "sim", q34: "sim", q35: "sim", q36: "nao",
    q37: "sim", q38: "nao", q39: "sim", q40: "sim",
    q41: "raras", q42: "nao", q43: "sim", q44: "sim",
    q45: "sim", q46: "sim",

    openQ1: "Sim, o aluno demonstra perfil adequado para a instituição.",
    openQ2: "Quando contrariado por colegas.",
    openQ3: "Faz uso de Ritalina.",

    registeredBy: 2
  };
}

async function enviarAvaliacoes() {
  let contador = 0;

  for (let studentId = 1; studentId <= 30; studentId++) {
    // regra:
    // - múltiplos de 3 recebem DUAS avaliações
    // - outros recebem UMA alternando tipo

    const requests = [];

    if (studentId % 3 === 0) {
      // recebe duas
      requests.push(criarPayload(studentId, "primeira"));
      requests.push(criarPayload(studentId, "segunda"));
    } else {
      // alterna
      const tipo = studentId % 2 === 0 ? "segunda" : "primeira";
      requests.push(criarPayload(studentId, tipo));
    }

    for (const payload of requests) {
      contador++;

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

        console.log(
          `✅ Req ${contador} - studentId ${payload.studentId} (${payload.evaluationType})`
        );

      } catch (error) {
        console.error(
          `❌ Erro studentId ${payload.studentId}:`,
          error.message
        );
      }

      // para garantir ~100 requisições
      if (contador >= 100) return;
    }
  }
}

enviarAvaliacoes();