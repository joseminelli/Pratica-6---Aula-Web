const API_URL = 'https://proweb.leoproti.com.br'; 

document.addEventListener('DOMContentLoaded', () => {
    carregarAlunos();

    const form = document.getElementById('formAluno');
    form.addEventListener('submit', salvarAluno);
});

async function carregarAlunos() {
    try {
        const response = await fetch(`${API_URL}/alunos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar alunos');
        }
        const alunos = await response.json();
        
        const tabela = document.getElementById('tabelaAlunos');
        tabela.innerHTML = ''; 

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.turma}</td>
                <td>${aluno.curso}</td>
                <td>${aluno.matricula}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="prepararEdicao(${aluno.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirAluno(${aluno.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(tr);
        });

    } catch (error) {
        console.error('Falha ao carregar alunos:', error);
        alert('Não foi possível carregar os alunos.');
    }
}

async function salvarAluno(event) {
    event.preventDefault(); 

    const id = document.getElementById('alunoId').value;
    const nome = document.getElementById('nome').value;
    const turma = document.getElementById('turma').value;
    const curso = document.getElementById('curso').value;
    const matricula = document.getElementById('matricula').value;

    if (!nome || !turma || !curso || !matricula) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const aluno = { nome, turma, curso, matricula };

    let method = 'POST';
    let url = `${API_URL}/alunos`;

    if (id) {
        method = 'PUT';
        url = `${API_URL}/alunos/${id}`;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar aluno');
        }

        alert('Aluno salvo com sucesso!');
        resetarFormulario();
        carregarAlunos();

    } catch (error) {
        console.error('Falha ao salvar aluno:', error);
        alert('Não foi possível salvar o aluno.');
    }
}


function resetarFormulario() {
    document.getElementById('formAluno').reset();
    document.getElementById('alunoId').value = '';
    document.getElementById('btnCancelar').style.display = 'none';
}

document.getElementById('btnCancelar').addEventListener('click', resetarFormulario);