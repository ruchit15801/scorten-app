// Interviews, Messages, Gigs, Courses, Payments, Notifications, Reviews, SkillTests, Uploads, Users, Admin
// Each follows the same module pattern: module.ts + controller.ts + service.ts

// ─── Interviews ────────────────────────────────────────────────────────────────
// Handles AI interview scheduling, question delivery, answer recording, report generation
// Key endpoints:
//   POST /interviews/schedule/:applicationId     - Schedule AI or school interview
//   GET  /interviews/:id                         - Get interview details
//   POST /interviews/:id/start                   - Start interview session (returns Agora token)
//   POST /interviews/:id/answer                  - Submit answer for a question
//   POST /interviews/:id/complete                - Complete interview and trigger AI report
//   GET  /interviews/teacher/my-interviews       - Teacher's interview history
//   GET  /interviews/school/pending              - School's pending interviews

// ─── Messages ─────────────────────────────────────────────────────────────────
// Real-time chat via Socket.IO
// Key endpoints:
//   GET  /messages/conversations                 - Get all conversations
//   GET  /messages/:conversationId               - Get messages in conversation
//   POST /messages/send                          - Send a message
//   PATCH /messages/:conversationId/read         - Mark messages as read
// Socket Events:
//   connection, disconnect, join_room, send_message, typing, stop_typing

// ─── Gigs ─────────────────────────────────────────────────────────────────────
// Teacher freelance gig marketplace
// Key endpoints:
//   GET  /gigs                                   - Browse all gigs
//   POST /gigs                                   - Create gig (teacher)
//   PATCH /gigs/:id                              - Update gig
//   POST /gigs/:id/book                          - Book a gig session (parent)
//   GET  /gigs/my-gigs                           - Teacher's gigs
//   GET  /gigs/bookings                          - Parent's bookings
//   POST /gigs/bookings/:id/start                - Start gig session (Agora token)
//   POST /gigs/bookings/:id/complete             - Complete session

// ─── Courses ──────────────────────────────────────────────────────────────────
// Learning management system
// Key endpoints:
//   GET  /courses                                - Browse courses
//   GET  /courses/:id                            - Course details
//   POST /courses/:id/enroll                     - Enroll in course
//   POST /courses/:id/progress                   - Update lesson progress
//   GET  /courses/my-enrollments                 - My enrolled courses
//   GET  /courses/:id/certificate                - Get certificate

// ─── Payments ─────────────────────────────────────────────────────────────────
// Razorpay payment processing
// Key endpoints:
//   POST /payments/create-order                  - Create Razorpay order
//   POST /payments/verify                        - Verify payment signature
//   GET  /payments/history                       - Payment history
//   GET  /payments/wallet                        - Wallet balance & transactions
//   POST /payments/withdraw                      - Withdraw wallet balance

// ─── Notifications ────────────────────────────────────────────────────────────
// Firebase Cloud Messaging push notifications
// Key endpoints:
//   GET  /notifications                          - Get all notifications
//   PATCH /notifications/:id/read               - Mark as read
//   PATCH /notifications/read-all               - Mark all as read
//   DELETE /notifications/:id                   - Delete notification

// ─── Reviews ──────────────────────────────────────────────────────────────────
// Rating and review system
// Key endpoints:
//   POST /reviews                                - Leave a review
//   GET  /reviews/teacher/:teacherId             - Get teacher reviews
//   GET  /reviews/school/:schoolId               - Get school reviews
//   DELETE /reviews/:id                          - Delete review (admin/self)

// ─── Skill Tests ──────────────────────────────────────────────────────────────
// Timed skill assessments with AI evaluation
// Key endpoints:
//   GET  /skill-tests                            - Browse available tests
//   GET  /skill-tests/:id                        - Get test (without answers)
//   POST /skill-tests/:id/attempt               - Submit test answers
//   GET  /skill-tests/results/me                 - My test results
//   GET  /skill-tests/:id/leaderboard            - Subject leaderboard

// ─── Uploads ──────────────────────────────────────────────────────────────────
// AWS S3 file uploads
// Key endpoints:
//   POST /uploads/resume                         - Upload resume PDF
//   POST /uploads/avatar                         - Upload profile picture
//   POST /uploads/demo-video                     - Upload demo video
//   POST /uploads/document                       - Upload certificate/document
//   DELETE /uploads/:key                         - Delete file

// ─── Users ────────────────────────────────────────────────────────────────────
// User account management
// Key endpoints:
//   GET  /users/:id                              - Get user by ID
//   PATCH /users/me                              - Update my account
//   PATCH /users/me/change-password             - Change password
//   DELETE /users/me                             - Delete account
//   POST /users/me/deactivate                   - Deactivate account

// ─── Admin ────────────────────────────────────────────────────────────────────
// Admin dashboard and management
// Key endpoints:
//   GET  /admin/users                            - List all users
//   PATCH /admin/users/:id/status               - Suspend/activate user
//   GET  /admin/schools/pending-verification    - Schools awaiting verification
//   PATCH /admin/schools/:id/verify             - Verify school
//   GET  /admin/payments                         - Revenue reports
//   GET  /admin/analytics                        - Platform analytics
//   POST /admin/credits                          - Add AI credits to school
//   GET  /admin/disputes                         - Manage disputes

export const STUB_MODULES = 'All remaining modules documented above - implement following the same pattern as Auth, Jobs, and Applications modules';
