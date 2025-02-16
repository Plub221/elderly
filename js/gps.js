// กำหนดค่าแผนที่
const map = L.map('map').setView([13.736717, 100.523186], 15); // พิกัดเริ่มต้น: กรุงเทพฯ
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker สำหรับแสดงตำแหน่งของผู้สูงอายุ
const elderlyMarker = L.marker([13.736717, 100.523186]).addTo(map);
elderlyMarker.bindPopup('ตำแหน่งของผู้สูงอายุ').openPopup();

// ฟังก์ชันดึงข้อมูล GPS ของผู้สูงอายุจากเซิร์ฟเวอร์
function fetchElderlyLocation() {
    fetch('/get-elderly-location') // ดึงตำแหน่งจากเซิร์ฟเวอร์
        .then(response => response.json())
        .then(data => {
            const { latitude, longitude } = data;

            // อัปเดตตำแหน่งของผู้สูงอายุ
            elderlyMarker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], 15);
            elderlyMarker.bindPopup(`ตำแหน่งล่าสุด: [${latitude.toFixed(6)}, ${longitude.toFixed(6)}]`).openPopup();
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
            alert('ไม่สามารถดึงข้อมูลตำแหน่งได้');
        });
}

// ดึงตำแหน่งทันทีเมื่อโหลดหน้าเว็บ
fetchElderlyLocation();

// เพิ่มปุ่มอัปเดตตำแหน่ง
document.getElementById('refreshLocation').addEventListener('click', fetchElderlyLocation);
