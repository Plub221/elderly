document.addEventListener("DOMContentLoaded", function() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
    if (!currentUser || currentUser.role !== "elderly") {
        alert("กรุณาเข้าสู่ระบบก่อน!");
        window.location.href = "login.html";
        return;
    }

    // แสดงชื่อผู้ใช้
    document.getElementById("elderlyName").textContent = currentUser.fullname;

    // โหลดตารางเวลาของผู้สูงอายุ
    loadSchedule(currentUser.email);

    // ตรวจสอบการแจ้งเตือน
    checkNotification(currentUser.email);

    // ตรวจสอบกิจกรรมทุกๆ 1 นาที
    setInterval(() => {
        checkScheduleForAlert(currentUser.email);
    }, 30000);

    // ออกจากระบบ
    document.getElementById("logoutButton").addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });

    // ปิดแจ้งเตือน
    document.getElementById("closeNotification").addEventListener("click", function() {
        document.getElementById("notificationBox").classList.add("hidden");
    });
});

// โหลดตารางกิจกรรมของผู้สูงอายุ
function loadSchedule(elderlyEmail) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    if (schedules[elderlyEmail] && schedules[elderlyEmail].length > 0) {
        schedules[elderlyEmail].forEach(task => {
            let li = document.createElement("li");
            li.innerHTML = `<span>${task.time} - ${task.task}</span>`;
            scheduleList.appendChild(li);
        });
    } else {
        let li = document.createElement("li");
        li.textContent = "ไม่มีตารางเวลาสำหรับวันนี้";
        scheduleList.appendChild(li);
    }
}

// ฟังก์ชันตรวจสอบและแจ้งเตือนเมื่อถึงเวลา
function checkScheduleForAlert(elderlyEmail) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let now = new Date();
    let currentHour = now.getHours().toString().padStart(2, '0');
    let currentMinute = now.getMinutes().toString().padStart(2, '0');
    let currentTime = `${currentHour}:${currentMinute}`;

    if (schedules[elderlyEmail]) {
        schedules[elderlyEmail].forEach(task => {
            if (task.time === currentTime) {
                playAlertSound();
                showTaskNotification(task.task);
            }
        });
    }
}

// ฟังก์ชันเล่นเสียงแจ้งเตือน
function playAlertSound() {
    let audio = new Audio("audio/alert.mp3");
    audio.play();
}

// ฟังก์ชันแสดงแจ้งเตือนบนหน้าจอ
function showTaskNotification(task) {
    let notificationBox = document.getElementById("notificationBox");
    let notificationText = document.getElementById("notificationText");
    notificationText.textContent = `ถึงเวลาสำหรับ: ${task}`;
    notificationBox.classList.remove("hidden");
}

// ตรวจสอบแจ้งเตือนจากผู้ดูแล
function checkNotification(elderlyEmail) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || {};

    if (notifications[elderlyEmail]) {
        document.getElementById("notificationBox").classList.remove("hidden");
        document.getElementById("notificationText").textContent = notifications[elderlyEmail];

        // ลบแจ้งเตือนเมื่อกดปิด
        document.getElementById("closeNotification").addEventListener("click", function() {
            document.getElementById("notificationBox").classList.add("hidden");
            delete notifications[elderlyEmail];
            localStorage.setItem("notifications", JSON.stringify(notifications));
        });
    }
}
