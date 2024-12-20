const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { handleSearch } = require('./routes/search');
const { handleUploadCourse, replaceCourse } = require('./routes/uploadCourse');
const { handleLogin, handleRegister } = require('./routes/auth');
const { maplink } = require('./routes/mapsearch');
const getCoursesRoute = require('./routes/getCourses');
const detailRoute = require('./routes/detail');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const app = express();
const port = 3000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://s0970603655:sdClglqFKkKJVJhd@cluster0.rh8bh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
    try {
        await client.connect();
        console.log('已連接到 MongoDB');
        return client.db('school');  // 返回資料庫物件
    } catch (err) {
        console.error('連接到 MongoDB 出錯:', err);
        throw err;
    }
}

const cors = require('cors');
app.use(cors());  // 開啟 CORS 支援

connectToMongo().then((db) => {
    // 中介軟體設置
    app.use(favicon(path.join(__dirname, 'public', 'picture','map.png')));
    app.use(express.json()); 
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public')); // 提供靜態檔案服務

    // 設定路由
    app.use('/api', getCoursesRoute(db));
    app.post('/login', (req, res) => handleLogin(req, res, db));
    app.post('/register', (req, res) => handleRegister(req, res, db));
    app.post('/search', handleSearch);
    app.post('/uploadCourse', (req, res) => handleUploadCourse(req, res, db));   // 綁定上傳課程處理函數
    app.post('/mapsearch', (req, res) => maplink(req, res, db));  // 传递 db 到 maplink 函数

    // 新增 detail 路由
    app.use('/', detailRoute);

    // 首頁路由
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'view', 'index.html'));
    });

    // 其他頁面路由
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'view', 'login.html'));
    });

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'view', 'register.html'));
    });

    app.get('/report', (req, res) => {
        res.sendFile(path.join(__dirname, 'view', 'report.html'));
    });

    app.get('/uploadClass', (req, res) => {
        res.sendFile(path.join(__dirname, 'view', 'uploadClass.html'));
    });

    app.get('/404', (req, res) => {
        res.sendFile(path.join(__dirname, 'view', '404.html'));
    });

    // 错误处理（404）
    app.use((req, res, next) => {
        res.status(404).send('Not Found');
    });

    // 全局错误处理
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    // 啟動伺服器
    app.listen(port, () => {
        console.log(`伺服器正在運行於 http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('伺服器啟動失敗:', err);
});
