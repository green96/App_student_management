// routes/curriculumRoutes.js
const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');

// Lấy tất cả học kỳ
router.get('/', curriculumController.getAllSemesters);

// Lấy học kỳ theo số
router.get('/semester/:semesterNumber', curriculumController.getSemesterByNumber);

// Tạo học kỳ mới
router.post('/', curriculumController.createSemester);

// Cập nhật toàn bộ học kỳ
router.put('/semester/:semesterNumber', curriculumController.updateSemester);

// Cập nhật môn học
router.put('/subject/:subjectId', curriculumController.updateSubject);

// Xóa môn học
router.delete('/subject/:subjectId', curriculumController.deleteSubject);

// Xóa học kỳ
router.delete('/semester/:semesterNumber', curriculumController.deleteSemester);

module.exports = router;