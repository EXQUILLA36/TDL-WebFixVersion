const cardContainer = document.getElementById("cardContainer");
const studID = document.getElementById("studentID");
const studName = document.getElementById("studentName");
const studSec = document.getElementById("studentSec");
const addBtn = document.getElementById("addBtn");

let students = [];

addBtn.addEventListener("click", addStudent);

async function loadStudents() {
  try {
    const response = await fetch("students.json");
    const data = await response.json();
    students = data;
    showStudents();
  } catch (error) {
    console.error("Error loading student data", error);
  }
}

function addStudent(e) {
  e.preventDefault();

  const id = studID.value.trim();
  const name = studName.value.trim();
  const section = studSec.value.trim();

  if (!id || !name || !section) {
    alert("Please fill out all fields!");
    return;
  }

  students.push({ id, name, section });
  showStudents();

  studID.value = "";
  studName.value = "";
  studSec.value = "";
}

function showStudents() {
  cardContainer.innerHTML = "";

  students.forEach((student, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <span>${student.id}</span>
      <span>${student.name}</span>
      <span>${student.section}</span>
      <button class="delete_Btn"></button>
    `;

    const deleteBtn = card.querySelector(".delete_Btn");
    deleteBtn.addEventListener("click", () => {
      deleteStudent(index);
    });

    cardContainer.appendChild(card);
  });
}

function deleteStudent(index) {
  students.splice(index, 1);
  showStudents();
}

loadStudents();