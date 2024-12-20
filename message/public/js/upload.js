function uploadCourseData(courseName, courseCode, courseTime, department, location) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert("用戶未登入，無法上傳資料");
        return;
    }

    const courseData = {
        節數: courseTime,
        星期: department,
        課程名稱: courseName,
        課號: courseCode,
        教室: location
    };

    if (!username || !courseData) {
        alert("缺少必要資料！");
        return;
    }

    // 發送上傳請求
    fetch('/uploadCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, courseData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('課程上傳成功');
        } else {
            if (data.replaceOption) {
                // 如果後端返回替換選項，提示用戶是否替換
                const replace = confirm(`${data.message} 是否替換現有課程？\n課程名稱: ${data.conflictingCourse.課程名稱}\n教室: ${data.conflictingCourse.教室}\n時間: ${data.conflictingCourse.節數}`);
                if (replace) {
                    // 課程替換的請求
                    replaceCourse(username, courseData);
                }
            } else {
                alert('課程上傳失敗: ' + data.message);
            }
        }
    })
    .catch(error => {
        console.error('上傳失敗:', error);
        alert('上傳失敗，請稍後再試');
    });
}

// 替換現有課程的函數
function replaceCourse(username, courseData) {
    fetch('/replaceCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, courseData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('課程已成功替換');
        } else {
            alert('課程替換失敗: ' + data.message);
        }
    })
    .catch(error => {
        console.error('替換失敗:', error);
        alert('替換課程失敗，請稍後再試');
    });
}
