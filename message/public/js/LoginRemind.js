const loggedIn = localStorage.getItem('loggedIn') === 'true'&& localStorage.getItem('username') !== null;
const loginStatusElement = document.getElementById('loginStatus');
const logoutBtn = document.getElementById('logoutBtn');
const uploadClassLink = document.getElementById('uploadClassLink'); // 獲取 "上傳課程" 按鈕
const resultsTableHeader = document.querySelector("#resultsTable thead tr"); // 獲取表頭行

if (loggedIn) {
    loginStatusElement.classList.add('logged-in');
    logoutBtn.style.display = 'block';
    uploadClassLink.style.display = 'block'; // 顯示 "上傳課程" 按鈕

    // 動態添加 "上傳課程" 表頭
    const uploadTh = document.createElement('th');
    uploadTh.textContent = '上傳課程';
    resultsTableHeader.appendChild(uploadTh);
} else {
    loginStatusElement.classList.remove('logged-in');
    logoutBtn.style.display = 'none';
    uploadClassLink.style.display = 'none'; // 隱藏 "上傳課程" 按鈕
}


logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username'); 
    window.location.reload();
});

