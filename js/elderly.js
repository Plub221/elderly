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

    // ออกจากระบบ
    document.getElementById("logoutButton").addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
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
            li.innerHTML = `
                <span>${task.time} - ${task.task}</span>
            `;
            scheduleList.appendChild(li);
        });
    } else {
        let li = document.createElement("li");
        li.textContent = "ไม่มีตารางเวลาสำหรับวันนี้";
        scheduleList.appendChild(li);
    }
}

// ฟังก์ชันแสดงปุ่มแจ้งเตือน
function showNotificationButton() {
    let elderlyEmail = document.getElementById("elderlyList").value;
    if (elderlyEmail) {
        document.getElementById("sendNotification").style.display = 'inline-block'; // แสดงปุ่มแจ้งเตือน
    } else {
        document.getElementById("sendNotification").style.display = 'none'; // ซ่อนปุ่ม
    }
}

function checkNotification(elderlyEmail) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || {};

    // ตรวจสอบว่ามีการแจ้งเตือนหรือไม่
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

// ปิดแจ้งเตือน
document.getElementById("closeNotification").addEventListener("click", function() {
    document.getElementById("notificationBox").classList.add("hidden");
});
