const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// ตัวอย่างข้อมูล GPS ของผู้สูงอายุ (จำลอง)
let elderlyLocation = {
    latitude: 13.736717,
    longitude: 100.523186
};

// API สำหรับอัปเดตตำแหน่งของผู้สูงอายุ
app.post('/update-location', (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
    }

    elderlyLocation = { latitude, longitude };
    res.json({ message: 'อัปเดตตำแหน่งสำเร็จ' });
});

// API สำหรับดึงตำแหน่งของผู้สูงอายุ
app.get('/get-elderly-location', (req, res) => {
    res.json(elderlyLocation);
});

// เปิดเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
