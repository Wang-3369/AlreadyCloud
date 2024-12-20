async function handleUploadCourse(req, res, db) {
    const { username, courseData } = req.body;
    console.log('收到的数据:', req.body); // 打印整个请求体

    if (!username || !courseData) {
        return res.status(400).json({ success: false, message: '使用者名稱或課程資料缺失' });
    }

    // 检查课程数据是否包含必要字段
    if (!courseData.課程名稱 || !courseData.課號 || !courseData.節數 || !courseData.星期 || !courseData.教室) {
        return res.status(400).json({ success: false, message: '課程資料不完整' });
    }

    try {
        const collection = db.collection('password'); // 假设有一个 users 集合来存储用户资料

        // 查找用户
        const user = await collection.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ success: false, message: '使用者不存在' });
        }

        // 打印用户的课程数据，帮助调试
        console.log('用户课程数据:', user.courses);

        // 查找是否存在相同星期和节数的课程
        const conflictingCourseIndex = user.courses
            ? user.courses.findIndex(existingCourse =>
                  existingCourse.星期 === courseData.星期 && existingCourse.節數 === courseData.節數)
            : -1;

        if (conflictingCourseIndex !== -1) {
            // 找到冲突课程，返回提示是否替换
            const conflictingCourse = user.courses[conflictingCourseIndex];
            console.log('冲突的课程:', conflictingCourse);

            return res.status(400).json({
                success: false,
                message: `與現有課程衝突: ${conflictingCourse.課程名稱}`,
                replaceOption: true // 添加一个标识，表示允许替换
            });
        }

        // 更新用户资料，将课程资料加入到用户的课程列表中
        const updatedUser = await collection.updateOne(
            { username: username },
            { $push: { courses: courseData } } // 将课程资料推送到 courses 数组中
        );

        if (updatedUser.modifiedCount > 0) {
            return res.status(200).json({ success: true, message: '课程上传成功' });
        } else {
            return res.status(500).json({ success: false, message: '课程上传失败' });
        }
    } catch (err) {
        console.error('服务器错误:', err);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
}

// 替换冲突课程
async function replaceCourse(req, res, db) {
    const { username, courseData } = req.body;

    if (!username || !courseData) {
        return res.status(400).json({ success: false, message: '使用者名稱或課程資料缺失' });
    }

    try {
        const collection = db.collection('password'); // 假设有一个 users 集合来存储用户资料

        // 删除冲突的课程
        await collection.updateOne(
            { username: username },
            { $pull: { courses: { 星期: courseData.星期, 節數: courseData.節數 } } }
        );

        // 添加新课程
        const updatedUser = await collection.updateOne(
            { username: username },
            { $push: { courses: courseData } }
        );

        if (updatedUser.modifiedCount > 0) {
            return res.status(200).json({ success: true, message: '課程已更新' });
        } else {
            return res.status(500).json({ success: false, message: '課程替換失敗' });
        }
    } catch (err) {
        console.error('服务器错误:', err);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
}

module.exports = { handleUploadCourse, replaceCourse };
