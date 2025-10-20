const cardContainer = document.getElementById("cardContainer");
const studID = document.getElementById("studentID");
const studName = document.getElementById("studentName");
const studSec = document.getElementById("studentSec");
const form = document.getElementById("studentForm");
const filterButtons = document.querySelectorAll(".filter_Btn");
const loadBtn = document.getElementById("loadBtn");

//Array object of students
let students = [];
//Event listener for load button
loadBtn.addEventListener("click", loadStudents);
//Event listenr for add button
form.addEventListener("submit", function (e) {
  e.preventDefault();
  addStudent();
});

//Loads stored datas in local storage
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("students");
  if (saved) {
    students = JSON.parse(saved);
    sortStudents();
    showStudents();
  } else {
    cardContainer.innerHTML = `<p class="empty">No data loaded yet</p>`;
  }
});

//===============================
//Fetches student from student.json and stores it in the array
//===============================
async function loadStudents() {
  try {
    cardContainer.innerHTML = `<p class="empty">Loading students...</p>`;
    let data = null;

    //1. Fetch latest data from students.json
    const response = await fetch("./students.json");
    if (!response.ok) throw new Error("students.json not found");

    data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid JSON format");

    console.log("Loaded from students.json");

    //2. Store data into global array
    students = data;

    //3. Save to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    //4. Display the list
    sortStudents();
    showStudents();

  } catch (error) {
    console.error("Error loading student data:", error);
    cardContainer.innerHTML = `<p class="empty">Failed to load students.json</p>`;
  }
}

//===============================
//Saves to local storage then display it
//===============================
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
  sortStudents();
  showStudents();
}

//===============================
//Add student
//===============================
function addStudent() {
  const id = studID.value.trim();
  const name = studName.value.trim();
  const section = studSec.value.trim();

  if (!id || !name || !section) {
    alert("Please fill out all fields!");
    return;
  }

  const idPattern = /^PDM-\d{4}-\d{6}$/i;
  if (!idPattern.test(id)) {
    alert("Invalid ID format! Use PDM-0000-000000");
    return;
  }

  if (students.some(s => s.id === id)) {
    alert("Duplicate Student ID!");
    return;
  }

  students.push({ id, name, section });
  saveStudents();
  form.reset();
}

//===============================
//Delete Student
//===============================
function deleteStudent(index) {
  students.splice(index, 1);
  saveStudents(); // instantly updates UI
}

//===============================
//Creates card and displays it
//===============================
function showStudents() {
  cardContainer.innerHTML = "";

  if (students.length === 0) {
    cardContainer.innerHTML = `<p class="empty">No students yet.</p>`;
    return;
  }

  // Creates one card per student
  students.forEach((student, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="info">
        <span class="id">${student.id}</span>
        <span class="name">${student.name}</span>
        <span class="sec">${student.section}</span>
      </div>
      <button class="delete_Btn" data-index="${index}">Delete</button>
    `;

    //Passes the index when the delete button is clicked
    card.querySelector(".delete_Btn").addEventListener("click", () => deleteStudent(index));

    //Adds the card into the container
    cardContainer.appendChild(card);
  });
}

//===============================
//Sorts the student
//===============================
function sortStudents() {
  students.sort((a, b) => a.id.localeCompare(b.id));
}

//===============================
//Event listner for section button thru attribute
//===============================
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    filterStudents(filter);
  });
});

function filterStudents(filter) {
  let filteredList = [];

  if (filter === "ALL") {
    filteredList = students;
  } else {
    filteredList = students.filter(student => student.section === filter);
  }

  showFilteredStudents(filteredList);
}

function showFilteredStudents(list) {
  cardContainer.innerHTML = "";

  if (list.length === 0) {
    cardContainer.innerHTML = `<p class="empty">No students found in this section.</p>`;
    return;
  }

  list.forEach((student, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="info">
        <span class="id">${student.id}</span>
        <span class="name">${student.name}</span>
        <span class="sec">${student.section}</span>
      </div>
      <button class="delete_Btn" data-index="${index}">Delete</button>
    `;

    card.querySelector(".delete_Btn").addEventListener("click", () => deleteStudent(index));
    cardContainer.appendChild(card);
  });
}
