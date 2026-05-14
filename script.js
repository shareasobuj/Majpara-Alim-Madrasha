// আপনার এপিআই কি এখানে রিপ্লেস করুন
const firebaseConfig = {
  apiKey: "AIzaSyBUtQ00RBIEPE247HRYIKguQ58vbx71Wk8",
  authDomain: "majpara-alim-madrasha.firebaseapp.com",
  databaseURL: "https://majpara-alim-madrasha-default-rtdb.firebaseio.com",
  projectId: "majpara-alim-madrasha",
  storageBucket: "majpara-alim-madrasha.firebasestorage.app",
  messagingSenderId: "383841858474",
  appId: "1:383841858474:web:2f7b3fcbf74f883da3f1d3",
  measurementId: "G-RJL1EBS37F"
};
// Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// ১. কানেকশন মনিটর
db.ref(".info/connected").on("value", (snap) => {
    const dot = document.getElementById("status-dot");
    const text = document.getElementById("status-text");
    if (snap.val() === true) {
        dot.style.background = "#00b894";
        text.innerText = "Systems Active";
    } else {
        dot.style.background = "#d63031";
        text.innerText = "Offline Mode";
    }
});

// ২. ট্যাব হ্যান্ডলার (স্মুথ নেভিগেশন)
window.tabHandler = function(target) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-menu li').forEach(l => l.classList.remove('active'));
    
    document.getElementById(target).classList.add('active');
    document.getElementById('page-title').innerText = target.charAt(0).toUpperCase() + target.slice(1);
    
    if(target === 'database') fetchRecords();
};

// ৩. স্টুডেন্ট ডাটা সেভ করা
document.getElementById('studentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('stuID').value;
    const studentData = {
        name: document.getElementById('stuName').value,
        class: document.getElementById('stuClass').value,
        guardian: document.getElementById('stuGuardian').value,
        addedOn: new Date().toLocaleDateString()
    };

    db.ref('students/' + id).set(studentData)
    .then(() => {
        alert("Registration Complete!");
        document.getElementById('studentForm').reset();
    }).catch(err => alert("Error: " + err.message));
});

// ৪. ডাটা ফেচিং
function fetchRecords() {
    const list = document.getElementById('studentData');
    db.ref('students').on('value', (snap) => {
        list.innerHTML = "";
        snap.forEach(child => {
            const val = child.val();
            list.innerHTML += `
                <tr>
                    <td><b>${child.key}</b></td>
                    <td>${val.name}</td>
                    <td>${val.class}</td>
                    <td><button onclick="deleteRow('${child.key}')" style="color:red; background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
        });
    });
}
