// Dados
let students = JSON.parse(localStorage.getItem("students")) || [];

// Seletores
const studentForm = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const totalStudentsEl = document.getElementById("total-students");
const totalLessonsDoneEl = document.getElementById("total-lessons-done");
const totalLessonsRemainingEl = document.getElementById("total-lessons-remaining");
const themeBtn = document.getElementById("toggle-theme");

// Renderizar
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
            <td>${student.level}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress" style="width: ${(student.lessonsDone / student.totalClasses) * 100}%"></div>
                </div>
                ${student.lessonsDone}/${student.totalClasses}
            </td>
            <td>
                <button onclick="incrementLesson(${index})">+1</button>
                <button onclick="deleteStudent(${index})">🗑</button>
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
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const level = document.getElementById("level").value;
    const totalClasses = parseInt(document.getElementById("total-classes").value);

    // Adiciona o novo aluno à lista
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

// Incrementar aula
function incrementLesson(index) {
    if (students[index].lessonsDone < students[index].totalClasses) {
        students[index].lessonsDone++;
        renderStudents();
    }
}

// Deletar aluno
function deleteStudent(index) {
    students.splice(index, 1);
    renderStudents();
}

// Lógica para o tema escuro
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    // Salva a preferência do usuário no localStorage
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", () => {
    // Carrega a preferência de tema do localStorage
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    } else if (localStorage.getItem("theme") === "light") {
        document.body.classList.remove("dark");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Se não houver preferência salva, usa a do sistema
        document.body.classList.add("dark");
    }

    renderStudents();
});