// আপনার এপিআই কোডগুলো এখানে খুব সাবধানে বসান
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

// ১. ফায়ারবেজ লোড চেক
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialized");
} catch (e) {
    alert("ফায়ারবেজ ইনিশিয়ালাইজ করতে ভুল হয়েছে: " + e.message);
}

const db = firebase.database();

// ২. কানেকশন চেক করার গ্যারান্টিড উপায়
db.ref(".info/connected").on("value", (snap) => {
    const statusText = document.getElementById("status-text");
    const dot = document.getElementById("status-dot");
    
    if (snap.val() === true) {
        if(statusText) statusText.innerText = "Systems Active";
        if(dot) dot.style.background = "#00b894";
        console.log("Connected to Firebase");
    } else {
        if(statusText) statusText.innerText = "Connecting/Error...";
        if(dot) dot.style.background = "#d63031";
    }
}, (error) => {
    alert("ডাটাবেস কানেকশন এরর: " + error.message);
});

// ৩. স্টুডেন্ট ডাটা সেভ করার ফাংশন
document.getElementById('studentForm').onsubmit = function(e) {
    e.preventDefault();
    
    const id = document.getElementById('stuID').value;
    const name = document.getElementById('stuName').value;
    const sClass = document.getElementById('stuClass').value;

    if(!id || !name) {
        alert("সবগুলো বক্স পূরণ করুন");
        return;
    }

    db.ref('students/' + id).set({
        name: name,
        class: sClass,
        date: new Date().toISOString()
    })
    .then(() => {
        alert("ছাত্রের নাম সফলভাবে সেভ হয়েছে!");
        document.getElementById('studentForm').reset();
    })
    .catch((err) => {
        alert("সেভ হয়নি! কারণ: " + err.message);
    });
};

// ৪. ট্যাব সুইচিং ফিক্স
window.tabHandler = function(target) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const activePage = document.getElementById(target);
    if(activePage) activePage.classList.add('active');
    
    if(target === 'database') {
        // ডাটাবেস ভিউ লোড করা
        const tbody = document.getElementById('studentData');
        db.ref('students').on('value', (snap) => {
            tbody.innerHTML = "";
            snap.forEach(child => {
                const s = child.val();
                tbody.innerHTML += `<tr><td>${child.key}</td><td>${s.name}</td><td>${s.class}</td></tr>`;
            });
        });
    }
};
