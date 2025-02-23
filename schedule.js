function loadSchedule(elderlyEmail) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    // ตรวจสอบว่าใน localStorage มีข้อมูลตารางสำหรับผู้สูงอายุคนนี้หรือไม่
    if (schedules[elderlyEmail] && schedules[elderlyEmail].length > 0) {
        // หากมีข้อมูล ให้แสดงตารางกิจกรรมพร้อมเวลา
        schedules[elderlyEmail].forEach((task, index) => {
            let li = document.createElement("li");
            li.innerHTML = `
                <span>${task.time} - ${task.task}</span>
                <button onclick="editTask('${elderlyEmail}', ${index})">แก้ไข</button>
                <button onclick="deleteTask('${elderlyEmail}', ${index})">ลบ</button>
            `;
            scheduleList.appendChild(li);
        });
    } else {
        // หากไม่มีข้อมูลตาราง ให้แสดงข้อความว่าไม่มีตาราง
        let li = document.createElement("li");
        li.textContent = "ไม่มีตารางเวลาสำหรับผู้สูงอายุคนนี้";
        scheduleList.appendChild(li);
    }
}
