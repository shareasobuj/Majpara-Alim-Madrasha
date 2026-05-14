// আপনার Firebase Config এখান থেকে শুরু
const firebaseConfig = {
      apiKey: "AIzaSyBUtQ00RBIEPE247HRYIKguQ58vbx71Wk8",
  authDomain: "majpara-alim-madrasha.firebaseapp.com",
  projectId: "majpara-alim-madrasha",
  storageBucket: "majpara-alim-madrasha.firebasestorage.app",
  messagingSenderId: "383841858474",
  appId: "1:383841858474:web:2f7b3fcbf74f883da3f1d3",
  measurementId: "G-RJL1EBS37F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

// ১. ডাটা সেভ করা (Student Admission)
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('stuName').value;
    const id = document.getElementById('stuID').value;
    const sClass = document.getElementById('stuClass').value;

    db.ref('students/' + id).set({
        name: name,
        id: id,
        class: sClass
    }).then(() => {
        alert("Student Registered Successfully!");
        studentForm.reset();
    }).catch(error => console.log(error));
});

// ২. ডাটা দেখানো (View Students)
function fetchStudents() {
    db.ref('students').on('value', (snapshot) => {
        studentList.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            let data = childSnapshot.val();
            let row = `<tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.class}</td>
                <td><button onclick="deleteStudent('${data.id}')" style="background:red;">Delete</button></td>
            </tr>`;
            studentList.innerHTML += row;
        });
    });
}

// ৩. সেকশন পরিবর্তন করা
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    if(sectionId === 'viewStudents') fetchStudents();
}

// ৪. ডাটা ডিলিট করা
function deleteStudent(id) {
    if(confirm("Are you sure?")) {
        db.ref('students/' + id).remove();
    }
}

// Initial connection check
db.ref('.info/connected').on('value', (snap) => {
    const status = document.getElementById('userStatus');
    status.innerText = snap.val() ? "● Online (Database Connected)" : "○ Offline";
    status.style.color = snap.val() ? "#2ecc71" : "#e74c3c";
});
