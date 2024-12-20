// routes/mapsearch.js
const { MongoClient } = require('mongodb');
const collectionName = 'mapclass';

async function maplink(req, res, db) {
    const query = req.body;
    const searchKey = query['教室'];  // 用户输入的教室代号，如 ACTCER 或 CE200

    const searchPrefix = searchKey.substring(0, 3);

    try {
        const collection = db.collection(collectionName);
        const mapData = await collection.find().toArray();

        let iframeData;
        mapData.forEach(item => {
            const keys = Object.keys(item);
            keys.forEach(key => {
                if (key.startsWith(searchPrefix)) {
                    iframeData = item[key];
                }
            });
        });

        if (iframeData) {
            return res.json({ iframe: iframeData });
        } else {
            return res.status(404).json({ message: '未找到匹配的教室' });
        }

    } catch (err) {
        console.error('服务器错误:', err);
        return res.status(500).json({ message: '服务器错误' });
    }
}

module.exports = { maplink };  // 确保 maplink 被正确导出
