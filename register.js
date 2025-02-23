document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let userData = {
        fullname: fullname,
        email: email,
        password: password,
        role: role
    };

    // ส่งข้อมูลไปบันทึกใน auth.js
    saveUser(userData);
});

// ใช้ฟังก์ชันจาก auth.js
function saveUser(user) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    if (users.some(u => u.email === user.email)) {
        alert("อีเมลนี้ถูกใช้ไปแล้ว");
        return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน");
    window.location.href = "login.html";
}
