// controllers/curriculumController.js
const Curriculum = require('../models/Curriculum');

// Lấy tất cả học kỳ
exports.getAllSemesters = async (req, res) => {
  try {
    const semesters = await Curriculum.find().sort({ semesterNumber: 1 });
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy học kỳ theo số
exports.getSemesterByNumber = async (req, res) => {
  try {
    const { semesterNumber } = req.params;
    const semester = await Curriculum.findOne({ semesterNumber });
    
    if (!semester) {
      return res.status(404).json({ message: 'Không tìm thấy học kỳ' });
    }
    
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo học kỳ mới
exports.createSemester = async (req, res) => {
  try {
    const { semesterNumber, subjects = [] } = req.body;
    
    const existingSemester = await Curriculum.findOne({ semesterNumber });
    if (existingSemester) {
      return res.status(400).json({ message: 'Học kỳ đã tồn tại' });
    }
    
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    const semester = new Curriculum({
      semesterNumber,
      subjects,
      totalCredits,
    });
    
    await semester.save();
    res.status(201).json(semester);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật toàn bộ học kỳ
exports.updateSemester = async (req, res) => {
  try {
    const { semesterNumber } = req.params;
    const { subjects } = req.body;
    
    const semester = await Curriculum.findOne({ semesterNumber });
    if (!semester) {
      return res.status(404).json({ message: 'Không tìm thấy học kỳ' });
    }
    
    semester.subjects = subjects;
    semester.totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    await semester.save();
    res.status(200).json(semester);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật môn học
exports.updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const updates = req.body;
    
    const semester = await Curriculum.findOne({
      'subjects._id': subjectId,
    });
    
    if (!semester) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }
    
    const subject = semester.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }
    
    // Cập nhật các trường được phép
    const allowedUpdates = ['name', 'credits', 'theoryHours', 'practiceHours', 'isRequired', 'isCompleted'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        subject[field] = updates[field];
      }
    });
    
    // Cập nhật lại tổng tín chỉ
    semester.totalCredits = semester.subjects.reduce((sum, s) => sum + s.credits, 0);
    
    await semester.save();
    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa môn học
exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const semester = await Curriculum.findOne({
      'subjects._id': subjectId,
    });
    
    if (!semester) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }
    
    semester.subjects.pull(subjectId);
    semester.totalCredits = semester.subjects.reduce((sum, s) => sum + s.credits, 0);
    
    await semester.save();
    res.status(200).json({ message: 'Xóa môn học thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa học kỳ
exports.deleteSemester = async (req, res) => {
  try {
    const { semesterNumber } = req.params;
    
    const semester = await Curriculum.findOneAndDelete({ semesterNumber });
    if (!semester) {
      return res.status(404).json({ message: 'Không tìm thấy học kỳ' });
    }
    
    res.status(200).json({ message: 'Xóa học kỳ thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};