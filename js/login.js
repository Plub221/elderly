document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = findUser(email, password);

    if (user) {
        alert("เข้าสู่ระบบสำเร็จ!");

        // บันทึก session ผู้ใช้
        localStorage.setItem("currentUser", JSON.stringify(user));

        // เปลี่ยนเส้นทางไปหน้าที่เหมาะสม
        if (user.role === "caregiver") {
            window.location.href = "caregiver.html";
        } else {
            window.location.href = "elderly.html";
        }
    } else {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
});

// ใช้ฟังก์ชันจาก auth.js
function findUser(email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => user.email === email && user.password === password);
}
