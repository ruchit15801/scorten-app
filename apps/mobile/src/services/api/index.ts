import apiClient from '../apiClient';

export const jobsAPI = {
  getJobs: (params?: any) => apiClient.get('/jobs', { params }),
  getJob: (id: string) => apiClient.get(`/jobs/${id}`),
  createJob: (data: any) => apiClient.post('/jobs', data),
  updateJob: (id: string, data: any) => apiClient.patch(`/jobs/${id}`, data),
  deleteJob: (id: string) => apiClient.delete(`/jobs/${id}`),
  getMyJobs: () => apiClient.get('/jobs/school/my-jobs'),
  togglePause: (id: string) => apiClient.patch(`/jobs/${id}/pause`),
};

export const applicationsAPI = {
  apply: (jobId: string, coverLetter?: string) =>
    apiClient.post(`/applications/apply/${jobId}`, { coverLetter }),
  getMyApplications: (status?: string) =>
    apiClient.get('/applications/my-applications', { params: { status } }),
  getJobApplications: (jobId: string, status?: string) =>
    apiClient.get(`/applications/job/${jobId}`, { params: { status } }),
  getApplication: (id: string) => apiClient.get(`/applications/${id}`),
  updateStatus: (id: string, status: string, note?: string) =>
    apiClient.patch(`/applications/${id}/status`, { status, note }),
  sendOffer: (id: string, offerData: any) => apiClient.post(`/applications/${id}/offer`, offerData),
  respondToOffer: (id: string, action: 'accept' | 'reject', signature?: string) =>
    apiClient.patch(`/applications/${id}/offer-response`, { action, signature }),
  withdraw: (id: string) => apiClient.patch(`/applications/${id}/withdraw`),
};

export const teachersAPI = {
  getTeachers: (params?: any) => apiClient.get('/teachers', { params }),
  getTeacher: (id: string) => apiClient.get(`/teachers/${id}`),
  getMyProfile: () => apiClient.get('/teachers/profile/me'),
  updateProfile: (data: any) => apiClient.patch('/teachers/profile/me', data),
  toggleAvailability: () => apiClient.patch('/teachers/profile/availability'),
};

export const schoolsAPI = {
  getSchools: (params?: any) => apiClient.get('/schools', { params }),
  getSchool: (id: string) => apiClient.get(`/schools/${id}`),
  getDashboard: () => apiClient.get('/schools/dashboard/me'),
  updateProfile: (data: any) => apiClient.patch('/schools/profile/me', data),
};

export const gigsAPI = {
  getGigs: (params?: any) => apiClient.get('/gigs', { params }),
  getGig: (id: string) => apiClient.get(`/gigs/${id}`),
  createGig: (data: any) => apiClient.post('/gigs', data),
  updateGig: (id: string, data: any) => apiClient.patch(`/gigs/${id}`, data),
  bookGig: (id: string, data: any) => apiClient.post(`/gigs/${id}/book`, data),
  getMyGigs: () => apiClient.get('/gigs/my-gigs'),
  getMyBookings: () => apiClient.get('/gigs/bookings'),
};

export const aiAPI = {
  analyzeResume: (resumeText: string) => apiClient.post('/ai/analyze-resume', { resumeText }),
  calculateProfileScore: (teacherId: string) => apiClient.post(`/ai/profile-score/${teacherId}`),
  generateQuestions: (subject: string, level: string, categories?: string[]) =>
    apiClient.post('/ai/generate-interview-questions', { subject, level, categories }),
  generateResume: (teacherProfile: any) => apiClient.post('/ai/generate-resume', { teacherProfile }),
  generateInterviewReport: (interviewId: string) => apiClient.post(`/ai/interview-report/${interviewId}`),
};

export const coursesAPI = {
  getCourses: (params?: any) => apiClient.get('/courses', { params }),
  getCourse: (id: string) => apiClient.get(`/courses/${id}`),
  enroll: (id: string) => apiClient.post(`/courses/${id}/enroll`),
  updateProgress: (id: string, lessonId: string) =>
    apiClient.post(`/courses/${id}/progress`, { lessonId }),
  getMyEnrollments: () => apiClient.get('/courses/my-enrollments'),
};

export const skillTestsAPI = {
  getTests: (params?: any) => apiClient.get('/skill-tests', { params }),
  getTest: (id: string) => apiClient.get(`/skill-tests/${id}`),
  submitTest: (id: string, answers: any[]) =>
    apiClient.post(`/skill-tests/${id}/attempt`, { answers }),
  getMyResults: () => apiClient.get('/skill-tests/results/me'),
};

export const paymentsAPI = {
  createOrder: (data: any) => apiClient.post('/payments/create-order', data),
  verifyPayment: (data: any) => apiClient.post('/payments/verify', data),
  getHistory: () => apiClient.get('/payments/history'),
  getWallet: () => apiClient.get('/payments/wallet'),
};

export const messagesAPI = {
  getConversations: () => apiClient.get('/messages/conversations'),
  getMessages: (conversationId: string, page?: number) =>
    apiClient.get(`/messages/${conversationId}`, { params: { page } }),
  sendMessage: (data: any) => apiClient.post('/messages/send', data),
  markRead: (conversationId: string) => apiClient.patch(`/messages/${conversationId}/read`),
};

export const notificationsAPI = {
  getAll: () => apiClient.get('/notifications'),
  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch('/notifications/read-all'),
};

export const uploadsAPI = {
  uploadResume: (formData: FormData) =>
    apiClient.post('/uploads/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadAvatar: (formData: FormData) =>
    apiClient.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadDemoVideo: (formData: FormData) =>
    apiClient.post('/uploads/demo-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadDocument: (formData: FormData) =>
    apiClient.post('/uploads/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
