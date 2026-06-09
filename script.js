// Student Registration System
// DOM Manipulation + Local Storage

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const studentCount = document.getElementById("studentCount");
const submitBtn = document.getElementById("submitBtn");
const tableContainer = document.getElementById("tableContainer");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// Load existing records
displayStudents();

// Form Submit

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    // Validation

    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^[0-9]+$/;
    const contactRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        name === "" ||
        studentId === "" ||
        email === "" ||
        contact === ""
    ) {
        showToast("Please fill all fields", "#ef4444");
        return;
    }

    if (!nameRegex.test(name)) {
        showToast("Name should contain only letters", "#ef4444");
        return;
    }

    if (!idRegex.test(studentId)) {
        showToast("Student ID should contain only numbers", "#ef4444");
        return;
    }

    if (!emailRegex.test(email)) {
        showToast("Enter a valid email address", "#ef4444");
        return;
    }

    if (!contactRegex.test(contact) || contact.length < 10) {
        showToast("Contact number must be at least 10 digits", "#ef4444");
        return;
    }

    const student = {
        name,
        studentId,
        email,
        contact
    };

    if (editIndex === -1) {

        students.push(student);

        showToast(
            "Student Added Successfully",
            "#10b981"
        );

    } else {

        students[editIndex] = student;

        showToast(
            "Student Updated Successfully",
            "#10b981"
        );

        editIndex = -1;

        submitBtn.innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Student';

        submitBtn.classList.remove("editing");
    }

    saveData();
    displayStudents();
    form.reset();
});

// Display Students

function displayStudents(filteredStudents = students) {

    studentTable.innerHTML = "";

    if (filteredStudents.length === 0) {

        studentTable.innerHTML = `
        <tr class="empty-row">
            <td colspan="5">
                No Student Records Found
            </td>
        </tr>
        `;

        updateCounter();
        return;
    }

    filteredStudents.forEach((student, index) => {

        studentTable.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${students.indexOf(student)})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${students.indexOf(student)})">

                    Delete

                </button>

            </td>
        </tr>
        `;
    });

    updateCounter();
    dynamicScrollbar();
}

// Edit Student

function editStudent(index) {

    document.getElementById("name").value =
        students[index].name;

    document.getElementById("studentId").value =
        students[index].studentId;

    document.getElementById("email").value =
        students[index].email;

    document.getElementById("contact").value =
        students[index].contact;

    editIndex = index;

    submitBtn.innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Student';

    submitBtn.classList.add("editing");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete Student

function deleteStudent(index) {

    const confirmation = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmation) return;

    students.splice(index, 1);

    saveData();
    displayStudents();

    showToast(
        "Student Deleted Successfully",
        "#ef4444"
    );
}

// Search Functionality

searchInput.addEventListener("keyup", function () {

    const value =
        searchInput.value.toLowerCase();

    const filteredStudents =
        students.filter(student =>

            student.name
                .toLowerCase()
                .includes(value)

            ||

            student.studentId
                .toLowerCase()
                .includes(value)

        );

    displayStudents(filteredStudents);
});

// Local Storage Save

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

// Student Counter

function updateCounter() {

    studentCount.textContent =
        students.length;
}

// Dynamic Scrollbar

function dynamicScrollbar() {

    if (students.length > 5) {

        tableContainer.style.maxHeight =
            "350px";

        tableContainer.style.overflowY =
            "auto";

    } else {

        tableContainer.style.maxHeight =
            "none";

        tableContainer.style.overflowY =
            "hidden";
    }
}

// Toast Notification

function showToast(message, color) {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}