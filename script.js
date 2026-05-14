// ১. ফায়ারবেজ কনফিগারেশন (আপনার কনসোল থেকে কপি করে এখানে বসান)
const firebaseConfig = {
    apiKey: "AIzaSyBUtQ00RBIEPE247HRYIKguQ58vbx71Wk8",
  authDomain: "majpara-alim-madrasha.firebaseapp.com",
  projectId: "majpara-alim-madrasha",
  storageBucket: "majpara-alim-madrasha.firebasestorage.app",
  messagingSenderId: "383841858474",
  appId: "1:383841858474:web:2f7b3fcbf74f883da3f1d3",
  measurementId: "G-RJL1EBS37F"
};

// ২. ফায়ারবেজ ইনিশিয়ালাইজ করা
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ৩. ডাটাবেস কানেকশন স্ট্যাটাস চেক করা
db.ref(".info/connected").on("value", (snap) => {
    const dot = document.getElementById("dot");
    const text = document.getElementById("status-text");
    if (snap.val() === true) {
        dot.className = "dot-green"; // অনলাইন হলে সবুজ ডট
        text.innerText = "Online";
    } else {
        dot.className = "dot-red"; // অফলাইন হলে লাল ডট
        text.innerText = "Offline";
    }
});

// ৪. স্টুডেন্ট রেজিস্ট্রেশন (অ্যাডমিশন ফর্ম)
const admissionForm = document.getElementById('admissionForm');
if(admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('id').value;
        const name = document.getElementById('name').value;
        const sClass = document.getElementById('class').value;
        const guardian = document.getElementById('guardian').value;

        // ডাটাবেসে ডাটা পাঠানো
        db.ref('students/' + id).set({
            name: name,
            class: sClass,
            guardian: guardian,
            timestamp: Date.now()
        })
        .then(() => {
            alert("সফলভাবে রেজিস্ট্রেশন হয়েছে!");
            admissionForm.reset();
        })
        .catch((error) => {
            alert("ভুল হয়েছে: " + error.message);
        });
    });
}

// ৫. ট্যাব বা পেজ পরিবর্তনের ফাংশন
window.showTab = function(tabName) {
    // সব সেকশন হাইড করা
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // সব মেনু থেকে একটিভ ক্লাস সরানো
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });
    
    // নির্দিষ্ট ট্যাব দেখানো
    const activeTab = document.getElementById(tabName);
    if(activeTab) {
        activeTab.classList.add('active');
    }
    
    // হেডার টাইটেল পরিবর্তন
    const titles = {
        'home': 'Portal Dashboard',
        'admission': 'Student Admission',
        'view': 'Student Records',
        'auth': 'Staff Authentication'
    };
    document.getElementById('tab-title').innerText = titles[tabName] || "Portal";
    
    // যদি ডাটাবেস পেজ হয় তবে ডাটা লোড করা
    if(tabName === 'view') loadStudents();
}

// ৬. ডাটাবেস থেকে স্টুডেন্ট লিস্ট নিয়ে আসা
function loadStudents() {
    const tbody = document.getElementById('studentTableBody');
    if(!tbody) return;

    db.ref('students').on('value', (snapshot) => {
        tbody.innerHTML = "";
        snapshot.forEach((child) => {
            const student = child.val();
            tbody.innerHTML += `
                <tr>
                    <td>${child.key}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>
                        <button onclick="deleteStudent('${child.key}')" style="color:red; cursor:pointer; border:none; background:none;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    });
}

// ৭. ডাটা ডিলিট করার ফাংশন
window.deleteStudent = function(id) {
    if(confirm("আপনি কি নিশ্চিতভাবে এই ডাটা ডিলিট করতে চান?")) {
        db.ref('students/' + id).remove();
    }
}
