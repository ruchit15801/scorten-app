import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { jobsAPI, applicationsAPI, teachersAPI, schoolsAPI, gigsAPI, coursesAPI, skillTestsAPI, aiAPI, uploadsAPI } from '../services/api';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

// ─── Jobs Hooks ────────────────────────────────────────────────────────────────

export const useJobs = (params?: any) =>
  useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsAPI.getJobs(params).then(r => r.data.data),
  });

export const useJob = (id: string) =>
  useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsAPI.getJob(id).then(r => r.data.data),
    enabled: !!id,
  });

export const useMyJobs = () =>
  useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobsAPI.getMyJobs().then(r => r.data.data),
  });

export const useCreateJob = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data: any) => jobsAPI.createJob(data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-jobs'] });
      dispatch(showToast({ message: 'Job posted successfully!', type: 'success' }));
    },
    onError: (err: any) => {
      dispatch(showToast({ message: err.response?.data?.message || 'Failed to post job', type: 'error' }));
    },
  });
};

// ─── Applications Hooks ────────────────────────────────────────────────────────

export const useMyApplications = (status?: string) =>
  useQuery({
    queryKey: ['applications', 'my', status],
    queryFn: () => applicationsAPI.getMyApplications(status).then(r => r.data.data),
  });

export const useJobApplications = (jobId: string, status?: string) =>
  useQuery({
    queryKey: ['applications', 'job', jobId, status],
    queryFn: () => applicationsAPI.getJobApplications(jobId, status).then(r => r.data.data),
    enabled: !!jobId,
  });

export const useApplyJob = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) =>
      applicationsAPI.apply(jobId, coverLetter).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      dispatch(showToast({ message: 'Application submitted!', type: 'success' }));
    },
    onError: (err: any) => {
      dispatch(showToast({ message: err.response?.data?.message || 'Application failed', type: 'error' }));
    },
  });
};

export const useRespondToOffer = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ id, action, signature }: { id: string; action: 'accept' | 'reject'; signature?: string }) =>
      applicationsAPI.respondToOffer(id, action, signature).then(r => r.data.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      dispatch(showToast({
        message: vars.action === 'accept' ? '🎉 Offer accepted!' : 'Offer declined',
        type: vars.action === 'accept' ? 'success' : 'info',
      }));
    },
  });
};

// ─── Teachers Hooks ────────────────────────────────────────────────────────────

export const useTeachers = (params?: any) =>
  useQuery({
    queryKey: ['teachers', params],
    queryFn: () => teachersAPI.getTeachers(params).then(r => r.data.data),
  });

export const useTeacher = (id: string) =>
  useQuery({
    queryKey: ['teachers', id],
    queryFn: () => teachersAPI.getTeacher(id).then(r => r.data.data),
    enabled: !!id,
  });

export const useMyTeacherProfile = () =>
  useQuery({
    queryKey: ['teacher-profile', 'me'],
    queryFn: () => teachersAPI.getMyProfile().then(r => r.data.data),
  });

export const useUpdateTeacherProfile = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data: any) => teachersAPI.updateProfile(data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-profile'] });
      dispatch(showToast({ message: 'Profile updated!', type: 'success' }));
    },
  });
};

// ─── School Hooks ──────────────────────────────────────────────────────────────

export const useSchoolDashboard = () =>
  useQuery({
    queryKey: ['school-dashboard'],
    queryFn: () => schoolsAPI.getDashboard().then(r => r.data.data),
  });

// ─── Gigs Hooks ────────────────────────────────────────────────────────────────

export const useGigs = (params?: any) =>
  useQuery({
    queryKey: ['gigs', params],
    queryFn: () => gigsAPI.getGigs(params).then(r => r.data.data),
  });

export const useMyGigs = () =>
  useQuery({
    queryKey: ['my-gigs'],
    queryFn: () => gigsAPI.getMyGigs().then(r => r.data.data),
  });

// ─── Courses Hooks ────────────────────────────────────────────────────────────

export const useCourses = (params?: any) =>
  useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesAPI.getCourses(params).then(r => r.data.data),
  });

export const useMyEnrollments = () =>
  useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => coursesAPI.getMyEnrollments().then(r => r.data.data),
  });

// ─── Skill Tests Hooks ────────────────────────────────────────────────────────

export const useSkillTests = (params?: any) =>
  useQuery({
    queryKey: ['skill-tests', params],
    queryFn: () => skillTestsAPI.getTests(params).then(r => r.data.data),
  });

export const useMyTestResults = () =>
  useQuery({
    queryKey: ['skill-test-results', 'me'],
    queryFn: () => skillTestsAPI.getMyResults().then(r => r.data.data),
  });

// ─── AI Hooks ─────────────────────────────────────────────────────────────────

export const useGenerateResume = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (teacherProfile: any) => aiAPI.generateResume(teacherProfile).then(r => r.data.data),
    onSuccess: () => {
      dispatch(showToast({ message: '✨ Resume generated by AI!', type: 'success' }));
    },
  });
};

export const useGenerateInterviewQuestions = () =>
  useMutation({
    mutationFn: ({ subject, level, categories }: any) =>
      aiAPI.generateQuestions(subject, level, categories).then(r => r.data.data),
  });
