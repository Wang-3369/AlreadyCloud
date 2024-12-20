const bcrypt = require('bcrypt');

// 假设 db 已经在外部连接并传递过来
const collectionName = 'password';
const saltRounds = 10;

// 處理登入請求
async function handleLogin(req, res, db) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '使用者名稱與密碼為必填項目' });
    }

    try {
        const collection = db.collection(collectionName);
        const user = await collection.findOne({ username: username });
        
        if (!user) {
            return res.status(401).json({ success: false, message: '使用者名稱或密碼錯誤' });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            // 登入成功，設置登入狀態
            res.cookie('loggedIn', 'true');
            return res.status(200).json({ success: true, message: '登入成功', username: user.username });
        } else {
            return res.status(401).json({ success: false, message: '使用者名稱或密碼錯誤' });
        }
    } catch (err) {
        console.error('伺服器錯誤:', err);
        return res.status(500).json({ success: false, message: '伺服器錯誤' });
    }
}

// 處理註冊請求
async function handleRegister(req, res, db) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('使用者名稱與密碼為必填項目');
    }

    try {
        const collection = db.collection(collectionName);

        const existingUser = await collection.findOne({ username: username });
        if (existingUser) {
            return res.status(400).send('使用者名稱已存在');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await collection.insertOne({ username, password: hashedPassword, courses: [] });

        return res.send('註冊成功');
    } catch (err) {
        console.error('伺服器錯誤:', err);
        return res.status(500).send('伺服器錯誤');
    }
}

module.exports = { handleLogin, handleRegister };
