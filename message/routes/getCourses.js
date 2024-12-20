const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/getCourses', async (req, res) => {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ success: false, message: '用户名缺失' });
        }

        try {
            const collection = db.collection('password');  // 使用传入的 db 对象，获取集合
            const user = await collection.findOne({ username });

            if (!user) {
                return res.status(404).json({ success: false, message: '用户不存在' });
            }

            // 假设用户课程数据存储在 user.courses 中
            const courses = user.courses;

            return res.status(200).json({ success: true, courses });
        } catch (err) {
            console.error('服务器错误:', err);
            return res.status(500).json({ success: false, message: '服务器错误' });
        }
    });

    return router;
};
