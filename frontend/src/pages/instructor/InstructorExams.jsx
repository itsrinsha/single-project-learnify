import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Trash2, 
  GitBranch, 
  Award, 
  Check, 
  ChevronRight,
  Sparkles,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getInstructorExams, createExam, updateExam, uploadExamResource, getExamAttempts, gradeAttempt, approveAttempt, publishExam, unpublishExam, duplicateExam, deleteExam } from '../../services/examService';
import { getInstructorCourses, getInstructorStudents } from '../../services/instructorService';

const InstructorExams = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [grading, setGrading] = useState(false);
  
  // Modals & Drawers state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create Exam Form state
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examType, setExamType] = useState('theory');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [passingMarks, setPassingMarks] = useState(40);
  const [attachment, setAttachment] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploadingResource, setUploadingResource] = useState(false);
  
  // New scheduling & task fields
  const [taskType, setTaskType] = useState('exam');
  const [instructions, setInstructions] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [deadline, setDeadline] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [assignedBatch, setAssignedBatch] = useState('');
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [showStudentsDropdown, setShowStudentsDropdown] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [testCasesInput, setTestCasesInput] = useState('');
  
  // Temporary list tags state
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState([]);

  // Questions state for theory exams
  const [questions, setQuestions] = useState([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [currentQuestionType, setCurrentQuestionType] = useState('mcq');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [currentCorrect, setCurrentCorrect] = useState(0);
  const [currentMarks, setCurrentMarks] = useState(1);
  const [currentStarterCode, setCurrentStarterCode] = useState('');
  const [currentExpectedOutput, setCurrentExpectedOutput] = useState('');
  const [currentTestCases, setCurrentTestCases] = useState('');
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');

  // Grade Form state
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const courseStudents = (students || []).filter(s => s.courseId === courseId);

  const normalizeCourses = (data) => {
    if (Array.isArray(data)) return data;
    if (!data) return [];
    return data.courses || data.data || data.all || data.result || [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsData, coursesData, studentsData] = await Promise.all([
        getInstructorExams(),
        getInstructorCourses(),
        getInstructorStudents()
      ]);
      setExams(examsData || []);
      setCourses(normalizeCourses(coursesData));
      setStudents(studentsData.students || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setCourses([]);
      setStudents([]);
      toast.error('Failed to load exams and courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetCreateForm = () => {
    setCourseId('');
    setTitle('');
    setDescription('');
    setExamType('theory');
    setScheduledDate('');
    setScheduledTime('');
    setDuration(60);
    setMaxAttempts(3);
    setPassingMarks(40);
    setTopics([]);
    setRequirements([]);
    setQuestions([]);
    setAttachment('');
    setAttachments([]);
    setTaskType('exam');
    setInstructions('');
    setTotalMarks(100);
    setDeadline('');
    setIsDraft(false);
    setAssignedBatch('');
    setAssignedStudents([]);
    setShowStudentsDropdown(false);
    setDifficulty('medium');
    setExpectedOutput('');
    setStarterCode('');
    setTestCasesInput('');
    setEditingQuestionIndex(null);
    setCurrentQuestionType('mcq');
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCurrentCorrect(0);
    setCurrentMarks(1);
    setCurrentStarterCode('');
    setCurrentExpectedOutput('');
    setCurrentTestCases('');
    setCurrentDifficulty('medium');
    setEditingExamId(null);
  };

  const parseTestCases = (raw) => raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [input = '', output = ''] = line.split('=>');
      return { input: input.trim(), output: output.trim() };
    });

  const getAssessmentType = () => {
    if (examType === 'machine_task') return 'coding';
    if (taskType === 'task') return 'mission_task';
    return questions.some((question) => question.type !== 'mcq') ? 'mixed' : 'theory';
  };

  const clearQuestionForm = () => {
    setEditingQuestionIndex(null);
    setCurrentQuestionType('mcq');
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCurrentCorrect(0);
    setCurrentMarks(1);
    setCurrentStarterCode('');
    setCurrentExpectedOutput('');
    setCurrentTestCases('');
    setCurrentDifficulty('medium');
  };

  const handleAddOrUpdateQuestion = () => {
    if (!currentQuestion.trim()) return toast.error('Please enter a question');
    if (Number(currentMarks) <= 0) return toast.error('Question marks must be greater than 0');
    if (currentQuestionType === 'mcq' && currentOptions.some(opt => !opt.trim())) {
      return toast.error('Please fill in all 4 options');
    }

    const nextQuestion = {
      type: currentQuestionType,
      question: currentQuestion.trim(),
      q: currentQuestion.trim(),
      options: currentQuestionType === 'mcq' ? currentOptions.map(o => o.trim()) : [],
      correct: currentQuestionType === 'mcq' ? currentCorrect : undefined,
      correctAnswer: currentQuestionType === 'mcq' ? currentCorrect : undefined,
      marks: Number(currentMarks),
      starterCode: currentQuestionType === 'coding' ? currentStarterCode : undefined,
      expectedOutput: ['coding', 'file_upload'].includes(currentQuestionType) ? currentExpectedOutput : undefined,
      testCases: currentQuestionType === 'coding' ? parseTestCases(currentTestCases) : [],
      difficulty: currentQuestionType === 'coding' ? currentDifficulty : undefined,
    };

    if (editingQuestionIndex !== null) {
      setQuestions(questions.map((question, index) => index === editingQuestionIndex ? nextQuestion : question));
      toast.success('Question updated!');
    } else {
      setQuestions([...questions, nextQuestion]);
      toast.success('Question added!');
    }

    clearQuestionForm();
  };

  const handleEditQuestion = (question, index) => {
    setEditingQuestionIndex(index);
    setCurrentQuestionType(question.type || 'mcq');
    setCurrentQuestion(question.q || question.question || '');
    setCurrentOptions(question.options?.length ? question.options : ['', '', '', '']);
    setCurrentCorrect(Number(question.correct || 0));
    setCurrentMarks(question.marks || 1);
    setCurrentStarterCode(question.starterCode || '');
    setCurrentExpectedOutput(question.expectedOutput || '');
    setCurrentTestCases((question.testCases || []).map((testCase) => `${testCase.input || ''} => ${testCase.output || ''}`).join('\n'));
    setCurrentDifficulty(question.difficulty || 'medium');
  };

  const handleResourceUpload = async (file) => {
    if (!file) return;
    setUploadingResource(true);
    try {
      const result = await uploadExamResource(file);
      setAttachment(result.url);
      setAttachments((prev) => [...prev, result.url]);
      toast.success('Resource uploaded successfully!');
    } catch (err) {
      console.error('Error uploading resource:', err);
      toast.error(err.response?.data?.message || 'Failed to upload resource.');
    } finally {
      setUploadingResource(false);
    }
  };

  const openCreateModal = () => {
    resetCreateForm();
    if (courses.length > 0) {
      const firstCourse = courses[0];
      setCourseId(firstCourse?._id || firstCourse?.id || firstCourse || '');
    }
    setShowCreateModal(true);
  };

  const openEditModal = (exam) => {
    setEditingExamId(exam._id);
    setCourseId(exam.course?._id || exam.course || '');
    setTitle(exam.title || '');
    setDescription(exam.description || '');
    setExamType(exam.examType || 'theory');
    setTaskType(exam.taskType || 'exam');
    setInstructions(exam.instructions || '');
    setDuration(exam.duration || 60);
    setMaxAttempts(exam.maxAttempts || 3);
    setPassingMarks(exam.passingMarks || 40);
    setTotalMarks(exam.totalMarks || 100);
    setTopics(exam.topics || []);
    setRequirements(exam.requirements || []);
    setQuestions(exam.questions || []);
    setAttachment(exam.attachment || '');
    setAttachments(exam.attachments || (exam.attachment ? [exam.attachment] : []));
    setAssignedBatch(exam.assignedBatch || '');
    setAssignedStudents((exam.assignedStudents || []).map((student) => student._id || student));
    setDifficulty(exam.difficulty || 'medium');
    setExpectedOutput(exam.expectedOutput || '');
    setStarterCode(exam.starterCode || '');
    setTestCasesInput((exam.testCases || []).map((testCase) => `${testCase.input || ''} => ${testCase.output || ''}`).join('\n'));
    setIsDraft(Boolean(exam.isDraft));

    if (exam.scheduledDate || exam.scheduledAt) {
      const scheduled = new Date(exam.scheduledDate || exam.scheduledAt);
      setScheduledDate(scheduled.toISOString().slice(0, 10));
      setScheduledTime(scheduled.toTimeString().slice(0, 5));
    } else {
      setScheduledDate('');
      setScheduledTime('');
    }

    setDeadline(exam.deadline ? new Date(exam.deadline).toISOString().slice(0, 16) : '');
    clearQuestionForm();
    setShowCreateModal(true);
  };

  const handleOpenSubmissions = async (exam) => {
    setSelectedExam(exam);
    setLoadingSubmissions(true);
    try {
      const attempts = await getExamAttempts(exam._id);
      setSubmissions(attempts || []);
    } catch (err) {
      console.error('Error fetching attempts:', err);
      toast.error('Failed to load submissions.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleCreateExamSubmit = async (e, forcedDraft = isDraft) => {
    e.preventDefault();

    if (!courseId) return toast.error('Please select a course.');
    if (!title.trim()) return toast.error('Please enter a title.');
    if (!description.trim()) return toast.error('Please enter a description.');
    if (!instructions.trim()) return toast.error('Please enter instructions.');
    if (taskType === 'exam' && (!scheduledDate || !scheduledTime)) return toast.error('Please select date and time.');
    if (taskType === 'task' && !deadline) return toast.error('Please select a deadline.');
    if (!Number.isFinite(Number(duration)) || Number(duration) <= 0) return toast.error('Duration must be greater than 0.');
    if (Number(totalMarks) <= 0) return toast.error('Total marks must be greater than 0.');
    if (Number(passingMarks) < 0 || Number(passingMarks) > Number(totalMarks)) return toast.error('Passing marks must be between 0 and total marks.');
    if (topics.length === 0) return toast.error('Please add at least one topic.');
    if (examType === 'machine_task' && requirements.length === 0) {
      return toast.error('Please add at least one coding requirement.');
    }
    if (examType !== 'machine_task' && questions.length === 0) {
      return toast.error('Please add at least one question.');
    }

    setCreating(true);
    try {
      let datetime = null;
      if (taskType === 'exam' && scheduledDate && scheduledTime) {
        datetime = new Date(`${scheduledDate}T${scheduledTime}`);
      }

      if (datetime && deadline && new Date(deadline) <= datetime) return toast.error('Deadline must be after the exam start time.');
      
      const payload = {
        type: getAssessmentType(),
        course: courseId,
        courseId,
        title,
        description,
        examType,
        scheduledDate: datetime ? datetime.toISOString() : undefined,
        scheduledAt: datetime ? datetime.toISOString() : undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        duration: Number(duration),
        maxAttempts: Number(maxAttempts),
        passingMarks: Number(passingMarks),
        totalMarks: Number(totalMarks),
        topics,
        requirements: examType === 'machine_task' ? requirements : [],
        questions: examType === 'machine_task' ? [] : questions,
        attachment: attachment.trim() || undefined,
        attachments,
        taskType,
        instructions,
        assignedBatch: assignedBatch.trim() || undefined,
        assignedBatches: assignedBatch.trim() ? [assignedBatch.trim()] : [],
        assignedStudents: assignedStudents,
        difficulty,
        expectedOutput,
        starterCode,
        testCases: parseTestCases(testCasesInput),
        isDraft: forcedDraft,
      };

      if (editingExamId) {
        await updateExam(editingExamId, payload);
      } else {
        await createExam(payload);
      }
      toast.success(editingExamId ? 'Assessment updated successfully!' : forcedDraft ? 'Assessment saved as draft!' : 'Assessment published successfully!');
      
      resetCreateForm();
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      console.error('Error creating exam:', err);
      toast.error(err.response?.data?.message || 'Failed to create exam.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Are you sure you want to delete this assessment? This will permanently delete all student submissions as well.")) {
      try {
        await deleteExam(examId);
        toast.success("Assessment deleted successfully!");
        fetchData();
      } catch (err) {
        console.error("Error deleting exam:", err);
        toast.error(err.response?.data?.message || "Failed to delete assessment.");
      }
    }
  };

  const handlePublishExam = async (examId) => {
    try {
      await publishExam(examId);
      toast.success("Assessment published successfully!");
      fetchData();
    } catch (err) {
      console.error("Error publishing exam:", err);
      toast.error(err.response?.data?.message || "Failed to publish assessment.");
    }
  };

  const handleUnpublishExam = async (examId) => {
    try {
      await unpublishExam(examId);
      toast.success("Assessment moved back to draft.");
      fetchData();
    } catch (err) {
      console.error("Error unpublishing exam:", err);
      toast.error(err.response?.data?.message || "Failed to unpublish assessment.");
    }
  };

  const handleDuplicateExam = async (examId) => {
    try {
      await duplicateExam(examId);
      toast.success("Assessment duplicated as draft.");
      fetchData();
    } catch (err) {
      console.error("Error duplicating exam:", err);
      toast.error(err.response?.data?.message || "Failed to duplicate assessment.");
    }
  };

  const handleAddTopic = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && topicInput.trim()) {
      e.preventDefault();
      const cleaned = topicInput.trim().replace(/,/g, '');
      if (cleaned && !topics.includes(cleaned)) {
        setTopics([...topics, cleaned]);
      }
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (indexToRemove) => {
    setTopics(topics.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddRequirement = (e) => {
    if (e.key === 'Enter' && reqInput.trim()) {
      e.preventDefault();
      const cleaned = reqInput.trim();
      if (cleaned && !requirements.includes(cleaned)) {
        setRequirements([...requirements, cleaned]);
      }
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (indexToRemove) => {
    setRequirements(requirements.filter((_, idx) => idx !== indexToRemove));
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (gradeScore === '') return toast.error('Please enter a grade score.');
    const scoreNum = Number(gradeScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      return toast.error('Score must be a number between 0 and 100.');
    }

    setGrading(true);
    try {
      await gradeAttempt(selectedAttempt._id, scoreNum, gradeFeedback);
      toast.success('Grade submitted successfully!');
      setSelectedAttempt(null);
      setGradeScore('');
      setGradeFeedback('');
      
      if (selectedExam) {
        handleOpenSubmissions(selectedExam);
      }
      fetchData();
    } catch (err) {
      console.error('Error grading attempt:', err);
      toast.error(err.response?.data?.message || 'Failed to grade student attempt.');
    } finally {
      setGrading(false);
    }
  };

  const handleApprovalUpdate = async (status) => {
    if (!selectedAttempt) return;
    setGrading(true);
    try {
      await approveAttempt(selectedAttempt._id, status, gradeFeedback);
      toast.success(status === 'approved' ? 'Submission approved!' : 'Submission rejected.');
      if (selectedExam) {
        handleOpenSubmissions(selectedExam);
      }
      setSelectedAttempt(null);
      setGradeScore('');
      setGradeFeedback('');
      fetchData();
    } catch (err) {
      console.error('Error updating submission approval:', err);
      toast.error(err.response?.data?.message || 'Failed to update submission.');
    } finally {
      setGrading(false);
    }
  };

  const totalExams = exams.length;
  const theoryExamsCount = exams.filter(e => e.examType === 'theory').length;
  const machineTasksCount = exams.filter(e => e.examType === 'machine_task').length;
  const [pendingGradingCount, setPendingGradingCount] = useState(0);

  useEffect(() => {
    if (exams.length > 0) {
      const fetchAllAttemptsCount = async () => {
        try {
          let pendingCount = 0;
          for (let exam of exams) {
            if (exam.examType === 'machine_task') {
              const attempts = await getExamAttempts(exam._id);
              pendingCount += attempts.filter(att => att.result === 'pending').length;
            }
          }
          setPendingGradingCount(pendingCount);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAllAttemptsCount();
    }
  }, [exams]);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || exam.examType === typeFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'draft') {
      matchesStatus = exam.isDraft === true;
    } else if (statusFilter !== 'all') {
      matchesStatus = !exam.isDraft && exam.status === statusFilter;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Loading assessment center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-105 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap size={28} className="text-primary-600" />
            Exams & Tasks Management
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Create assessments, theory quizzes, and grade coding tasks.</p>
        </div>
        <button 
          type="button"
          onClick={openCreateModal}
          className="btn-primary py-3 px-6 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5"
        >
          <Plus size={16} />
          Create Assessment
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4.5 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center border border-primary-100/50">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalExams}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Exams</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4.5 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{theoryExamsCount}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Theory Exams</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4.5 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100/50">
            <GitBranch size={18} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{machineTasksCount}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Machine Tasks</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4.5 hover:shadow-md transition-shadow relative overflow-hidden">
          {pendingGradingCount > 0 && (
            <span className="absolute top-3.5 right-3.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/50">
            <AlertCircle size={18} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{pendingGradingCount}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Grading</p>
          </div>
        </div>
      </div>

      {/* Filter and Content Grid */}
      <div className="space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm">
          <div className="relative w-full md:w-80 flex items-center">
            <Search size={16} className="absolute left-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title or course..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-semibold"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-44 px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-650 outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
            >
              <option value="all">All Assessment Types</option>
              <option value="theory">Theory Exams</option>
              <option value="machine_task">Machine Tasks</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-44 px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-650 outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Exams List */}
        {filteredExams.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-4">
            <GraduationCap size={44} className="mx-auto text-slate-200 animate-pulse" />
            <div>
              <p className="text-slate-550 font-bold text-sm">No assessments match filters</p>
              <p className="text-slate-400 text-xs mt-1">Create custom tests, written exams, or coding tasks for your classes.</p>
            </div>
            <button 
              type="button"
              onClick={openCreateModal} 
              className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5"
            >
              Add First Exam
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredExams.map((exam) => (
              <div 
                key={exam._id} 
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 md:p-8 space-y-5">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        exam.examType === 'machine_task' 
                          ? 'bg-purple-50 text-purple-650 border-purple-100/50' 
                          : 'bg-emerald-50 text-emerald-650 border-emerald-100/50'
                      }`}>
                        {exam.examType === 'machine_task' ? '💻 Machine Task' : '📝 Theory Exam'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        exam.taskType === 'task' 
                          ? 'bg-indigo-50 text-indigo-605 border-indigo-100/50' 
                          : 'bg-sky-50 text-sky-655 border-sky-100/50'
                      }`}>
                        {exam.taskType === 'task' ? '📋 Task' : '⏱️ Exam'}
                      </span>
                      {exam.isDraft && (
                        <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-600 border-amber-100/50">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Max Attempts: {exam.maxAttempts || 3}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">
                      {exam.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-450 flex items-center gap-1.5 pt-0.5">
                      <BookOpen size={13} className="text-primary-600" /> {exam.course?.title}
                    </p>
                  </div>

                  {exam.description && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                      {exam.description}
                    </p>
                  )}

                  {exam.topics && exam.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exam.topics.slice(0, 4).map((topic, index) => (
                        <span key={index} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[8px] font-black rounded-lg border border-slate-150 uppercase tracking-wider">
                          {topic}
                        </span>
                      ))}
                      {exam.topics.length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold rounded-lg border border-slate-200">
                          +{exam.topics.length - 4} More
                        </span>
                      )}
                    </div>
                  )}

                  {/* Info details */}
                  <div className="flex flex-wrap items-center gap-4.5 pt-4 border-t border-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {exam.scheduledDate ? (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        Start: {new Date(exam.scheduledDate).toLocaleDateString()}
                      </span>
                    ) : exam.deadline ? (
                      <span className="flex items-center gap-1.5 text-red-500">
                        <Calendar size={13} />
                        Deadline: {new Date(exam.deadline).toLocaleDateString()}
                      </span>
                    ) : null}
                    {exam.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        {exam.duration} mins
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Award size={13} />
                      Marks: {exam.totalMarks || 100}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      Submissions: {exam.totalSubmissions || 0}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteExam(exam._id)}
                      className="p-2 bg-white text-red-500 hover:bg-red-50 border border-slate-200 rounded-xl transition-all active:scale-95 shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => openEditModal(exam)}
                      className="p-2 bg-white text-primary-600 hover:bg-primary-50 border border-slate-200 rounded-xl transition-all active:scale-95 shadow-sm"
                      title="Edit"
                    >
                      <FileText size={13} />
                    </button>
                    <button
                      onClick={() => handleDuplicateExam(exam._id)}
                      className="p-2 bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-95 shadow-sm"
                      title="Duplicate"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {exam.isDraft && (
                      <button 
                        onClick={() => handlePublishExam(exam._id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Publish
                      </button>
                    )}
                    {!exam.isDraft && (
                      <button 
                        onClick={() => handleUnpublishExam(exam._id)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Unpublish
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenSubmissions(exam)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-primary-600 hover:text-white hover:border-transparent rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      Submissions
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE EXAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/30">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{editingExamId ? 'Edit Assessment' : 'Create Assessment'}</h3>
                <p className="text-slate-500 text-xs font-semibold mt-1">Configure theory quizzes or coding projects for your classes.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-650"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Select Course */}
              <div className="space-y-2">
                <label htmlFor="exam-course-select" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Select Course</label>
                <select 
                  id="exam-course-select"
                  name="courseId"
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    setAssignedStudents([]);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                  required
                >
                  <option value="" disabled>-- Select Course --</option>
                  {Array.isArray(courses) && courses.map((course) => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="exam-batch-input" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Batch Identifier</label>
                  <input
                    id="exam-batch-input"
                    name="batch"
                    type="text"
                    placeholder="e.g. MERN Web Dev Batch C"
                    value={assignedBatch}
                    onChange={(e) => setAssignedBatch(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2 relative" onMouseLeave={() => setShowStudentsDropdown(false)}>
                  <label htmlFor="exam-assign-students-btn" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Assign Candidates</label>
                  <div className="relative">
                    <button
                      id="exam-assign-students-btn"
                      name="assignStudentsBtn"
                      type="button"
                      onClick={() => setShowStudentsDropdown(!showStudentsDropdown)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white text-left flex justify-between items-center transition-all"
                    >
                      <span className="truncate">
                        {assignedStudents.length === 0 ? "All Students (Default)" : `${assignedStudents.length} Student(s) Selected`}
                      </span>
                      <ChevronRight size={14} className={`transform transition-transform ${showStudentsDropdown ? 'rotate-90' : ''} shrink-0 ml-2`} />
                    </button>
                    
                    {showStudentsDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-4 space-y-2">
                        {courseStudents.length === 0 ? (
                          <p className="text-xs text-slate-400 font-bold p-2 text-center">No enrolled students found.</p>
                        ) : (
                          <>
                            <div 
                              onClick={() => {
                                if (assignedStudents.length === courseStudents.length) {
                                  setAssignedStudents([]);
                                } else {
                                  setAssignedStudents(courseStudents.map(s => s.studentId));
                                }
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border-b border-slate-100 pb-2 mb-2"
                            >
                              <input 
                                id="student-chk-all"
                                name="selectAllStudents"
                                type="checkbox"
                                checked={assignedStudents.length === courseStudents.length && courseStudents.length > 0}
                                readOnly
                                className="rounded border-slate-350 text-primary-600 focus:ring-primary-500"
                              />
                              <label htmlFor="student-chk-all" className="text-[10px] font-black text-slate-700 uppercase tracking-widest cursor-pointer">Select All</label>
                            </div>
                            {courseStudents.map((student) => {
                              const isChecked = assignedStudents.includes(student.studentId);
                              return (
                                <div
                                  key={student.studentId}
                                  onClick={() => {
                                    if (isChecked) {
                                      setAssignedStudents(assignedStudents.filter(id => id !== student.studentId));
                                    } else {
                                      setAssignedStudents([...assignedStudents, student.studentId]);
                                    }
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <input
                                    id={`student-chk-${student.studentId}`}
                                    name={`student-${student.studentId}`}
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-550"
                                  />
                                  <label htmlFor={`student-chk-${student.studentId}`} className="flex flex-col cursor-pointer">
                                    <span className="text-xs font-bold text-slate-800">{student.name}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{student.email}</span>
                                  </label>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Category Picker */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Task Category</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setTaskType('exam')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      taskType === 'exam' 
                        ? 'border-primary-500 bg-primary-50/10' 
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      taskType === 'exam' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Clock size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Standard Exam</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Real-time scheduled quiz</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setTaskType('task')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      taskType === 'task' 
                        ? 'border-primary-500 bg-primary-50/10' 
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      taskType === 'task' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <FileText size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Mission Task</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Deadline based project</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Assessment Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React hooks project or Javascript basic quiz"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Enter assessment goals..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Instructions</label>
                  <textarea 
                    rows="3"
                    placeholder="Instructions for students taking this assessment..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Assessment Type Picker */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Assessment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setExamType('theory')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      examType === 'theory' 
                        ? 'border-primary-500 bg-primary-50/10' 
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      examType === 'theory' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <FileText size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Theory Exam</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">MCQ / Written concepts</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setExamType('machine_task')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      examType === 'machine_task' 
                        ? 'border-purple-500 bg-purple-50/10' 
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      examType === 'machine_task' ? 'bg-purple-650 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <GitBranch size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Machine Task</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Git repository submission</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduled / Deadline */}
              {taskType === 'exam' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Scheduled Date</label>
                    <input 
                      type="date" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Scheduled Time</label>
                    <input 
                      type="time" 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Submission Deadline</label>
                  <input 
                    type="datetime-local" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                    required
                  />
                </div>
              )}

              {/* Assessment Parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {taskType === 'exam' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-0.5">Duration (min)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-0.5">Max Attempts</label>
                  <input 
                    type="number" 
                    min="1"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-0.5">Passing Marks (%)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-0.5">Total Marks</label>
                  <input 
                    type="number" 
                    min="1"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Topics Cover (Enter to add)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hooks, Context API, Redux"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={handleAddTopic}
                  className="input-field"
                />
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {topics.map((topic, i) => (
                      <span key={i} className="px-2.5 py-1.5 bg-primary-50 text-primary-650 text-[10px] font-bold rounded-lg border border-primary-100/30 uppercase tracking-wider flex items-center gap-1.5">
                        {topic}
                        <button type="button" onClick={() => handleRemoveTopic(i)} className="hover:text-primary-850">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirements (For machine task) */}
              {examType === 'machine_task' && (
                <div className="space-y-2 border-t border-slate-100 pt-5">
                  <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest px-0.5">Coding Guidelines (Enter to add)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Write clean functions, Include README details"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    onKeyDown={handleAddRequirement}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-purple-500 transition-all"
                  />
                  {requirements.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {requirements.map((req, i) => (
                        <div key={i} className="p-3 bg-purple-50/50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-100/40 flex items-center justify-between">
                          <span>{req}</span>
                          <button type="button" onClick={() => handleRemoveRequirement(i)} className="text-purple-400 hover:text-purple-650">
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Machine Task details */}
              {examType === 'machine_task' && (
                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest px-0.5">Guidelines Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10 focus:bg-white transition-all"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Expected Output</label>
                      <input
                        type="text"
                        placeholder="e.g. Deployed project URL"
                        value={expectedOutput}
                        onChange={(e) => setExpectedOutput(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Starter Instructions</label>
                    <textarea
                      rows="3"
                      placeholder="Optional starter code templates or layout comments..."
                      value={starterCode}
                      onChange={(e) => setStarterCode(e.target.value)}
                      className="input-field resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Test Cases</label>
                    <textarea
                      rows="3"
                      placeholder="input => expected output (one per line)"
                      value={testCasesInput}
                      onChange={(e) => setTestCasesInput(e.target.value)}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Theory Questions */}
              {examType === 'theory' && (
                <div className="space-y-6 border-t border-slate-100 pt-5">
                  <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest px-0.5">Assessment Questions ({questions.length} Added)</h4>
                  
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Question Type</label>
                        <select
                          value={currentQuestionType}
                          onChange={(e) => setCurrentQuestionType(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10"
                        >
                          <option value="mcq">MCQ</option>
                          <option value="text">Text Answer</option>
                          <option value="file_upload">File Upload Task</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Marks</label>
                        <input
                          type="number"
                          min="1"
                          value={currentMarks}
                          onChange={(e) => setCurrentMarks(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Question Text</label>
                      <input 
                        type="text"
                        placeholder="Enter the question text..."
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10"
                      />
                    </div>

                    {currentQuestionType === 'mcq' && (
                      <div className="grid grid-cols-2 gap-4">
                        {currentOptions.map((opt, optIdx) => (
                          <div key={optIdx} className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5 flex justify-between items-center">
                              <span>Option {optIdx + 1}</span>
                              <span className="flex items-center gap-1">
                                <input 
                                  type="radio" 
                                  name="correctOption" 
                                  checked={currentCorrect === optIdx}
                                  onChange={() => setCurrentCorrect(optIdx)}
                                  className="text-primary-600 focus:ring-primary-500" 
                                />
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Correct</span>
                              </span>
                            </label>
                            <input 
                              type="text"
                              placeholder={`Option ${optIdx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...currentOptions];
                                newOpts[optIdx] = e.target.value;
                                setCurrentOptions(newOpts);
                              }}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/10"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      type="button"
                      onClick={handleAddOrUpdateQuestion}
                      className="w-full py-2.5 bg-primary-50 text-primary-650 hover:bg-primary-100 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-primary-100 flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
                    </button>
                  </div>

                  {/* Questions List */}
                  {questions.length > 0 && (
                    <div className="space-y-3">
                      {questions.map((q, idx) => (
                        <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-start gap-4 shadow-sm">
                          <div className="space-y-1.5 flex-1">
                            <p className="text-xs font-bold text-slate-800">Q{idx + 1}: {q.q}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{q.type || 'mcq'} • {q.marks || 1} marks</p>
                            {q.options?.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 pl-4 pt-1">
                                {q.options.map((opt, oIdx) => (
                                  <p key={oIdx} className={`text-[10px] font-semibold ${q.correct === oIdx ? 'text-green-600 font-extrabold' : 'text-slate-400'}`}>
                                    {oIdx + 1}. {opt} {q.correct === oIdx && '✓'}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button 
                              type="button" 
                              onClick={() => handleEditQuestion(q, idx)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <FileText size={14} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setQuestions(questions.filter((_, qIdx) => qIdx !== idx))}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reference Attachment */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Attachments / reference pdf</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  className="input-field"
                />
                <label className="w-full py-3 bg-primary-50 text-primary-650 border border-primary-100 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:bg-primary-100 transition-all shadow-sm shadow-primary-600/5">
                  {uploadingResource ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon size={14} />}
                  {uploadingResource ? 'Uploading File...' : 'Upload Reference PDF'}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleResourceUpload(e.target.files?.[0])}
                    disabled={uploadingResource}
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {attachments.map((url, index) => (
                      <div key={url} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary-600 truncate max-w-[400px]">
                          Reference_{index + 1}.pdf
                        </a>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter((item) => item !== url))}
                          className="text-red-400 hover:text-red-650"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save as Draft */}
              <div className="flex items-center gap-3 px-0.5 border-t border-slate-105 pt-5">
                <input 
                  type="checkbox" 
                  id="isDraft"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isDraft" className="text-xs font-semibold text-slate-600 cursor-pointer">
                  Save as Draft (Students will not see this assessment until published)
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-6 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="w-full btn-secondary py-3 text-xs uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={creating}
                  onClick={(e) => {
                    setIsDraft(true);
                    handleCreateExamSubmit(e, true);
                  }}
                  className="w-full btn-secondary py-3 text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5"
                >
                  {creating && isDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Draft'}
                </button>
                <button 
                  type="button"
                  disabled={creating}
                  onClick={(e) => {
                    setIsDraft(false);
                    handleCreateExamSubmit(e, false);
                  }}
                  className="w-full btn-primary py-3 text-xs uppercase tracking-wider rounded-xl"
                >
                  {creating && !isDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editingExamId ? 'Update & Publish' : 'Publish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Student Submissions</h3>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    (selectedExam.examType === 'machine_task' || selectedExam.taskType === 'task') ? 'bg-purple-50 text-purple-650 border border-purple-100/50' : 'bg-emerald-50 text-emerald-650 border border-emerald-100/50'
                  }`}>
                    {(selectedExam.examType === 'machine_task' || selectedExam.taskType === 'task') ? 'Machine Task' : 'Theory'}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-semibold mt-1">Exam: {selectedExam.title} ({selectedExam.course?.title})</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedExam(null);
                  setSelectedAttempt(null);
                }} 
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-650"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8 min-h-0">
              {/* Left Side: Attempts List */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Submissions List</h4>
                
                {loadingSubmissions ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading attempts...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="py-16 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No attempts recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => {
                      const isSelected = selectedAttempt?._id === submission._id;
                      return (
                        <div 
                          key={submission._id}
                          onClick={() => {
                            if (selectedExam.examType === 'machine_task' || selectedExam.taskType === 'task') {
                              setSelectedAttempt(submission);
                              setGradeScore(submission.score || '');
                              setGradeFeedback(submission.feedback || '');
                            }
                          }}
                          className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                            (selectedExam.examType === 'machine_task' || selectedExam.taskType === 'task') ? 'cursor-pointer' : ''
                          } ${
                            isSelected 
                              ? 'border-primary-500 bg-primary-50/5 shadow-sm' 
                              : 'border-slate-150 hover:border-slate-200 bg-slate-50/30'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 font-extrabold flex items-center justify-center shrink-0 uppercase border border-primary-200/40">
                              {submission.student?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-800">{submission.student?.name || 'Student'}</p>
                              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                                <span>Attempt #{submission.attemptNumber}</span>
                                <span>•</span>
                                <span>{new Date(submission.attemptedAt || submission.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex items-center gap-3">
                            <div>
                              {submission.result === 'pending' ? (
                                <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                                  Pending Eval
                                </span>
                              ) : (
                                <div className="space-y-0.5">
                                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                    submission.result === 'pass' 
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                      : 'bg-red-50 text-red-650 border border-red-105'
                                  }`}>
                                    {submission.result}
                                  </span>
                                  <p className="text-xs font-black text-slate-700 mt-1">{submission.score}%</p>
                                </div>
                              )}
                            </div>
                            {(selectedExam.examType === 'machine_task' || selectedExam.taskType === 'task') && (
                              <ChevronRight size={15} className="text-slate-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Side: Grading Section */}
              {(selectedExam.examType === 'machine_task' || selectedExam.taskType === 'task') && (
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between shrink-0">
                  {selectedAttempt ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <h4 className="text-[10px] font-black text-purple-650 uppercase tracking-widest">Evaluate Task</h4>
                        <span className="text-[9px] font-bold text-slate-400">Attempt #{selectedAttempt.attemptNumber}</span>
                      </div>

                      {/* Repo URL */}
                      {selectedAttempt.submissionUrl && (
                        <div className="p-4 bg-slate-950 rounded-xl text-white space-y-1 relative overflow-hidden">
                          <span className="text-[9px] font-black uppercase tracking-widest text-purple-300">Submitted Repository</span>
                          <a 
                            href={selectedAttempt.submissionUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-bold text-white hover:underline flex items-center gap-1.5 w-full break-all"
                          >
                            <ExternalLink size={13} className="shrink-0 text-purple-350" />
                            {selectedAttempt.submissionUrl}
                          </a>
                        </div>
                      )}

                      {/* Notes */}
                      {selectedAttempt.studentNotes && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Student Notes</span>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs font-medium text-slate-600 max-h-32 overflow-y-auto leading-relaxed">
                            {selectedAttempt.studentNotes}
                          </div>
                        </div>
                      )}

                      {/* Grading Form */}
                      <form onSubmit={handleGradeSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Award Score (0 - 100)</label>
                          <div className="relative flex items-center">
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="Score percentage"
                              value={gradeScore}
                              onChange={(e) => setGradeScore(e.target.value)}
                              className="input-field"
                              required
                            />
                            <span className="absolute right-4 text-xs font-black text-slate-400">%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Feedback Comments</label>
                          <textarea 
                            rows="3"
                            placeholder="Leave remarks about the implementation..."
                            value={gradeFeedback}
                            onChange={(e) => setGradeFeedback(e.target.value)}
                            className="input-field resize-none"
                            required
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={grading}
                          className="w-full btn-primary py-3 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5"
                        >
                          {grading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Submit Grade'}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={grading}
                            onClick={() => handleApprovalUpdate('approved')}
                            className="py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={grading}
                            onClick={() => handleApprovalUpdate('rejected')}
                            className="py-2.5 bg-red-50 text-red-655 border border-red-100/50 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200">
                      <Sparkles size={28} className="text-primary-305 mb-2.5 animate-pulse" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a candidate submission to award grade marks.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InstructorExams;
