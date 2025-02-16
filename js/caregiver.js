document.addEventListener("DOMContentLoaded", function() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "caregiver") {
        alert("กรุณาเข้าสู่ระบบก่อน!");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("caregiverName").textContent = currentUser.fullname;

    // โหลดรายชื่อผู้สูงอายุที่ดูแล
    loadElderlyList();

    // ฟังก์ชันเพิ่มกิจกรรม
    document.getElementById("addTask").addEventListener("click", function() {
        addTask();
    });

    // ฟังก์ชันส่งการแจ้งเตือน
    document.getElementById("sendNotification").addEventListener("click", function() {
        sendNotification();
    });

    // ฟังก์ชันดูตำแหน่ง
    document.getElementById("viewLocation").addEventListener("click", function() {
        openMap();
    });

    // ฟังก์ชันออกจากระบบ
    document.getElementById("logoutButton").addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
});

// ✅ ฟังก์ชันเปิดแผนที่ ดูตำแหน่ง GPS ของผู้สูงอายุ
function openMap() {
    let elderlyEmail = document.getElementById("elderlyList").value;
    let gpsLocations = JSON.parse(localStorage.getItem("gpsLocations")) || {};

    if (gpsLocations[elderlyEmail]) {
        let { lat, lng } = gpsLocations[elderlyEmail];
        let url = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(url, "_blank");
    } else {
        alert("ยังไม่มีตำแหน่งล่าสุดจากโทรศัพท์ของผู้สูงอายุ");
    }
}

// ✅ โหลดรายชื่อผู้สูงอายุที่ดูแล
function loadElderlyList() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let elderlyList = document.getElementById("elderlyList");

    users.forEach(user => {
        if (user.role === "elderly") {
            let option = document.createElement("option");
            option.value = user.email;
            option.textContent = user.fullname;
            elderlyList.appendChild(option);
        }
    });

    elderlyList.addEventListener("change", function() {
        loadSchedule(this.value);
    });

    if (elderlyList.options.length > 0) {
        loadSchedule(elderlyList.value);
    }
}

// ✅ โหลดตารางกิจกรรมของผู้สูงอายุ
function loadSchedule(elderlyEmail) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    if (schedules[elderlyEmail]) {
        schedules[elderlyEmail].forEach((task, index) => {
            if (task.time && task.task) {
                let li = document.createElement("li");
                li.innerHTML = `
                    <span>${task.time} - ${task.task}</span>
                    <button onclick="editTask('${elderlyEmail}', ${index})">แก้ไข</button>
                    <button onclick="deleteTask('${elderlyEmail}', ${index})">ลบ</button>
                `;
                scheduleList.appendChild(li);
            } else {
                console.error("ข้อมูลกิจกรรมไม่ถูกต้อง:", task);
            }
        });
    } else {
        scheduleList.innerHTML = "<li>ไม่มีตารางเวลาสำหรับวันนี้</li>";
    }
}

// ✅ เพิ่มกิจกรรมให้ผู้สูงอายุ
function addTask() {
    let elderlyEmail = document.getElementById("elderlyList").value;
    let newTask = document.getElementById("newTask").value.trim();
    let taskTime = document.getElementById("taskTime").value;

    if (!elderlyEmail || !newTask || !taskTime) {
        alert("กรุณากรอกกิจกรรมให้ครบถ้วน");
        return;
    }

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    if (!schedules[elderlyEmail]) {
        schedules[elderlyEmail] = [];
    }

    schedules[elderlyEmail].push({ task: newTask, time: taskTime });
    localStorage.setItem("schedules", JSON.stringify(schedules));

    document.getElementById("newTask").value = "";
    document.getElementById("taskTime").value = "";
    loadSchedule(elderlyEmail);
}

// ✅ แก้ไขกิจกรรม
function editTask(elderlyEmail, index) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let task = schedules[elderlyEmail][index];

    let newTask = prompt("แก้ไขกิจกรรม:", task.task);
    let newTime = prompt("แก้ไขเวลา:", task.time);

    if (newTask !== null && newTime !== null) {
        schedules[elderlyEmail][index] = { task: newTask, time: newTime };
        localStorage.setItem("schedules", JSON.stringify(schedules));
        loadSchedule(elderlyEmail);
    }
}

// ✅ ลบกิจกรรม
function deleteTask(elderlyEmail, index) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    schedules[elderlyEmail].splice(index, 1);

    if (schedules[elderlyEmail].length === 0) {
        delete schedules[elderlyEmail];
    }

    localStorage.setItem("schedules", JSON.stringify(schedules));
    loadSchedule(elderlyEmail);
}

// ✅ ส่งการแจ้งเตือนให้ผู้สูงอายุ
function sendNotification() {
    let elderlyEmail = document.getElementById("elderlyList").value;

    if (!elderlyEmail) {
        alert("กรุณาเลือกผู้สูงอายุ");
        return;
    }

    let notifications = JSON.parse(localStorage.getItem("notifications")) || {};
    notifications[elderlyEmail] = "ถึงเวลาที่ต้องกลับบ้านแล้ว!";
    localStorage.setItem("notifications", JSON.stringify(notifications));

    let notificationBox = document.getElementById("notificationBox");
    let notificationText = document.getElementById("notificationText");
    notificationText.textContent = notifications[elderlyEmail];
    notificationBox.classList.remove("hidden");

    alert("ส่งแจ้งเตือนไปยังผู้สูงอายุแล้ว!");
}

// ✅ ฟังก์ชันปิดการแจ้งเตือน
document.getElementById("closeNotification").addEventListener("click", function() {
    document.getElementById("notificationBox").classList.add("hidden");
});
