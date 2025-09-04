// Dados
let students = JSON.parse(localStorage.getItem("students")) || [];

// Seletores
const studentForm = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const totalStudentsEl = document.getElementById("total-students");
const totalLessonsDoneEl = document.getElementById("total-lessons-done");
const totalLessonsRemainingEl = document.getElementById("total-lessons-remaining");
const themeBtn = document.getElementById("toggle-theme");

// Renderizar alunos
function renderStudents() {
    studentList.innerHTML = "";
    let totalLessonsDone = 0;
    let totalLessonsRemaining = 0;

    students.forEach((student, index) => {
        totalLessonsDone += student.lessonsDone;
        totalLessonsRemaining += (student.totalClasses - student.lessonsDone);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.level}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress" style="width: ${(student.lessonsDone / student.totalClasses) * 100}%"></div>
                </div>
                ${student.lessonsDone}/${student.totalClasses}
            </td>
            <td>
                <button class="increment-btn" data-index="${index}">+1</button>
                <button class="delete-btn" data-index="${index}">🗑</button>
            </td>
        `;
        studentList.appendChild(tr);
    });

    totalStudentsEl.textContent = students.length;
    totalLessonsDoneEl.textContent = totalLessonsDone;
    totalLessonsRemainingEl.textContent = totalLessonsRemaining;

    localStorage.setItem("students", JSON.stringify(students));
}

// Adicionar aluno
studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const level = document.getElementById("level").value;
    const totalClasses = parseInt(document.getElementById("total-classes").value);

    if (!name || !email || !level || isNaN(totalClasses) || totalClasses <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    students.push({
        name,
        email,
        level,
        totalClasses,
        lessonsDone: 0
    });

    studentForm.reset();
    renderStudents();
});

// Delegação de eventos para botões da tabela
studentList.addEventListener("click", (e) => {
    const target = e.target;
    const index = target.dataset.index;

    if (target.classList.contains("increment-btn")) {
        if (students[index].lessonsDone < students[index].totalClasses) {
            students[index].lessonsDone++;
            renderStudents();
        }
    } else if (target.classList.contains("delete-btn")) {
        if (confirm(`Tem certeza que deseja deletar ${students[index].name}?`)) {
            students.splice(index, 1);
            renderStudents();
        }
    }
});

// Tema escuro
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    } else if (savedTheme === "light") {
        document.body.classList.remove("dark");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark");
    }

    renderStudents();
});