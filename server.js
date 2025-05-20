const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// 添加静态文件服务
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, 'visit-data.json');

app.use(express.json());

// 读取访问数据
async function readVisitData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // 如果文件不存在，返回空对象
        return {};
    }
}

// 保存访问数据
async function saveVisitData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API端点：获取访问数据
app.get('/api/visit-counts', async (req, res) => {
    try {
        const data = await readVisitData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API端点：保存访问数据
app.post('/api/visit-counts', async (req, res) => {
    try {
        await saveVisitData(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 修改监听端口（如果需要）
const PORT = 3000;  // 可以根据需要修改端口
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 