// 获取课程数据并填充表格
window.onload = function() {
    console.log("页面加载完毕");
    // 获取当前用户课程数据
    const username = localStorage.getItem('username');  // 假设已登录用户存储在 localStorage
    if (!username) {
        alert("用户未登录");
        return;
    }

    // 发起请求获取课程数据
    console.log('嘗試發送 API 請求...');
    fetch(`/api/getCourses?username=${username}`)
        .then(response => response.json())
        .then(data => {
            console.log("從後端獲取的數據:", data);
            if (data.success) {
                alert("數據加載");
                fillSchedule(data.courses);  // 假设返回的数据结构是 { success: true, courses: [...] }
            } else {
                alert("无法加载课程数据");
            }
        })
        .catch(error => {
            console.error("请求失败:", error);
            alert("获取课程数据失败");
        });
};

// 填充课程表格
function fillSchedule(courses) {
    // 获取表格单元格
    const cells = document.querySelectorAll('.table-container table tbody td');
    console.log("檢測到的單元格數量:", cells.length);


    // 遍历课程数据
    courses.forEach(course => {
        const courseTime = course['節數'];  // 如：第八節15:10~16:00
        const courseWeekday = course['星期'];  // 如：星期三
        console.log(`课程时间: ${courseTime}, 星期: ${courseWeekday}`);
        // 找到对应的行和列
        const rowIndex = getRowIndexByTime(courseTime);  // 根据节数找到行号
        const colIndex = getColumnIndexByWeekday(courseWeekday);  // 根据星期找到列号
        console.log(`行号: ${rowIndex}, 列号: ${colIndex}`);
        // 填充课程数据
        if (rowIndex >= 0 && colIndex >= 0) {
            const cellIndex = rowIndex * 8 + colIndex;  // 计算单元格的索引
            const cell = cells[cellIndex];

            if (cell) {
                // 直接插入课程名称和教室按钮
                const courseName = course['課程名稱'];
                const classroom = course['教室'];
                
                // 发送请求以获取教室地图链接
                fetch('/mapsearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ '教室': classroom })  // 发送教室查询
                })
                .then(response => response.json())
                .then(mapData => {
                    const iframeContent = mapData.iframe;  // 假设API返回的是iframe数据
                    const classroomLink = `<button id="showMapBtn" class="map-btn" data-iframe="${encodeURIComponent(iframeContent)}">${classroom}</button>`;

                    // 将课程名称和教室按钮填充到单元格中
                    cell.innerHTML = `${courseName}<br>${classroomLink}`;
                    
                    // 为地图按钮添加点击事件，点击后跳转到地图页面
                    const detailLink = cell.querySelector('.map-btn');
                    if (detailLink) {
                        detailLink.addEventListener('click', function(event) {
                            event.preventDefault();
                            const iframeData = this.getAttribute('data-iframe'); // 获取iframe数据
                            const courseDetails = encodeURIComponent(JSON.stringify(course)); // 转换课程信息为JSON并编码
                            // 跳转到detail页面并附加课程信息和地图iframe
                            window.location.href = `/detail?iframe=${iframeData}&courseDetails=${courseDetails}`;
                        });
                    }
                })
                .catch(error => {
                    console.error("请求失败:", error);
                    alert("获取教室地图数据失败");
                });
            } else {
                console.log(`无法找到对应的单元格: 行 - ${rowIndex}, 列 - ${colIndex}`);
            }
        } else {
            console.log(`无法映射课程: 时间 - ${courseTime}, 星期 - ${courseWeekday}`);
        }
        
    });
}

// 根据课程时间获取行号（节数对应行）
function getRowIndexByTime(time) {
    const timeMapping = {
        '第0節06:20~08:10': 0,
        '第一節08:20~09:10': 1,
        '第二節09:20~10:10': 2,
        '第三節10:20~11:10': 3,
        '第四節11:15~12:05': 4,
        '第五節12:10~13:00': 5,
        '第六節13:10~14:00': 6,
        '第七節14:10~15:00': 7,
        '第八節15:10~16:00': 8,
        '第九節16:05~16:55': 9,
        '第十節17:30~18:20': 10,
        '第十一節18:30~19:20': 11,
        '第十二節19:25~20:15': 12,
        '第十三節20:20~21:10': 13,
        '第十四節21:15~22:05': 14
    };
    return timeMapping[time] || -1;  // 返回对应的行号，若无匹配则返回 -1
}

// 根据课程星期获取列号
function getColumnIndexByWeekday(weekday) {
    const weekdayMapping = {
        '星期1': 1,  
        '星期2': 2, 
        '星期3': 3, 
        '星期4': 4, 
        '星期5': 5,  
        '星期6': 6,  
        '星期7': 7  
    };
    return weekdayMapping[weekday] || -1;  // 返回对应的列号，若无匹配则返回 -1
}

