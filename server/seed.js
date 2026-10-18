// ============================================
// HuntOS Database Seeder
// Engineered by Niranjan Krishnakumar
// ============================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const log = (level, msg) => console.log(`[${level}] [${new Date().toISOString()}] ${msg}`);

const seed = async () => {
  try {
    log('INFO', 'Starting HuntOS database seed...');

    // Clean existing data safely
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE activity_logs');
    await db.query('TRUNCATE TABLE reminders');
    await db.query('TRUNCATE TABLE interview_rounds');
    await db.query('TRUNCATE TABLE applications');
    await db.query('TRUNCATE TABLE resume_versions');
    await db.query('TRUNCATE TABLE companies');
    await db.query('TRUNCATE TABLE users');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    log('INFO', 'All tables truncated cleanly');

    // ─── Insert Primary User (Niranjan Krishnakumar) ──────────────────────────
    const passwordHash = await bcrypt.hash('hunt123', 10);
    const [userResult] = await db.query(
      `INSERT INTO users (name, email, password_hash, phone, college, branch, graduation_year, whatsapp_subscribed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Niranjan Krishnakumar', 'niranjan@huntos.dev', passwordHash, '9876543210', 'Department of Computer Science', 'Computer Science & Engineering', 2026, 1]
    );
    const userId = userResult.insertId;
    log('INFO', `Creator profile seeded: Niranjan Krishnakumar (ID: ${userId})`);

    // ─── Insert Companies ─────────────────────────────────────────────────────
    const companies = [
      ['Google', 'product'],
      ['Microsoft', 'product'],
      ['Amazon', 'product'],
      ['Stripe', 'fintech'],
      ['Atlassian', 'product'],
      ['Uber', 'product'],
      ['Razorpay', 'fintech'],
      ['Zomato', 'startup'],
      ['Databricks', 'product'],
      ['Postman', 'startup'],
    ];

    for (const [name, type] of companies) {
      await db.query('INSERT INTO companies (name, type) VALUES (?, ?)', [name, type]);
    }
    log('INFO', '10 tech companies inserted');

    // ─── Insert Resume Versions ───────────────────────────────────────────────
    const [resumeResult1] = await db.query(
      `INSERT INTO resume_versions (user_id, name, version, cloudinary_url, cloudinary_public_id, ats_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'Software Systems & Distributed Architecture', 'v2.4', 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', 'huntos/resumes/swe_systems_v2', 94]
    );
    const [resumeResult2] = await db.query(
      `INSERT INTO resume_versions (user_id, name, version, cloudinary_url, cloudinary_public_id, ats_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'Full Stack Product Engineer Resume', 'v3.0', 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', 'huntos/resumes/fsd_product_v3', 88]
    );
    const resume1Id = resumeResult1.insertId;
    const resume2Id = resumeResult2.insertId;
    log('INFO', 'Resume versions seeded with ATS scores');

    // ─── Insert Applications ──────────────────────────────────────────────────
    const today = new Date();
    const dateOffset = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() - days);
      return d.toISOString().split('T')[0];
    };

    const applications = [
      {
        company_name: 'Google',
        role: 'Software Engineer (L3)',
        location: 'Bangalore / Hybrid',
        package: '48 LPA (Base + Stocks)',
        application_date: dateOffset(42),
        deadline: null,
        status: 'Offer Received',
        priority: 'High',
        tags: 'Dream Job, Distributed Systems, High Priority',
        resume_version_id: resume1Id,
        notes: 'Secured via internal referral from Google Staff Engineer. 4 technical rounds completed.',
      },
      {
        company_name: 'Stripe',
        role: 'Software Engineer — Payments Platform',
        location: 'Remote',
        package: '42 LPA',
        application_date: dateOffset(35),
        deadline: null,
        status: 'Technical Round 3',
        priority: 'High',
        tags: 'Fintech, Remote, High Priority',
        resume_version_id: resume1Id,
        notes: 'Final system design and integration round coming up this Thursday.',
      },
      {
        company_name: 'Microsoft',
        role: 'Software Development Engineer II',
        location: 'Hyderabad',
        package: '44 LPA',
        application_date: dateOffset(28),
        deadline: null,
        status: 'HR Round',
        priority: 'High',
        tags: 'Cloud, Azure, Product',
        resume_version_id: resume2Id,
        notes: 'All coding rounds cleared with flying colors. Awaiting final partner HR discussion.',
      },
      {
        company_name: 'Atlassian',
        role: 'Full Stack Engineer',
        location: 'Bengaluru / Remote',
        package: '38 LPA',
        application_date: dateOffset(21),
        deadline: null,
        status: 'Technical Round 2',
        priority: 'Medium',
        tags: 'Remote, React, Node.js',
        resume_version_id: resume2Id,
        notes: 'Values alignment and live pair-programming round.',
      },
      {
        company_name: 'Uber',
        role: 'Backend Engineer — Marketplace',
        location: 'Hyderabad',
        package: '46 LPA',
        application_date: dateOffset(14),
        deadline: null,
        status: 'OA Cleared',
        priority: 'High',
        tags: 'Algorithms, Real-time, Referral',
        resume_version_id: resume1Id,
        notes: 'Scored 100% on OA HackerRank test. First tech round scheduled.',
      },
      {
        company_name: 'Razorpay',
        role: 'Software Development Engineer',
        location: 'Bangalore',
        package: '28 LPA',
        application_date: dateOffset(9),
        deadline: null,
        status: 'OA Scheduled',
        priority: 'Medium',
        tags: 'Fintech, Fast Growing',
        resume_version_id: resume2Id,
        notes: 'Online test link active till Sunday.',
      },
      {
        company_name: 'Databricks',
        role: 'Systems Software Engineer',
        location: 'Bengaluru',
        package: '52 LPA',
        application_date: dateOffset(4),
        deadline: dateOffset(-10),
        status: 'Applied',
        priority: 'High',
        tags: 'Big Data, C++, Distributed',
        resume_version_id: resume1Id,
        notes: 'Applied through careers portal with tailored resume.',
      },
      {
        company_name: 'Postman',
        role: 'Software Engineer — Core Tools',
        location: 'Bangalore',
        package: '26 LPA',
        application_date: dateOffset(2),
        deadline: dateOffset(-7),
        status: 'Applied',
        priority: 'Medium',
        tags: 'Developer Tools, API',
        resume_version_id: resume2Id,
        notes: 'Sent personalized message to recruiter on LinkedIn.',
      },
    ];

    const appIds = [];
    for (const app of applications) {
      const [r] = await db.query(
        `INSERT INTO applications
          (user_id, company_name, role, location, package, application_date, deadline, status, priority, tags, resume_version_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          app.company_name,
          app.role,
          app.location,
          app.package,
          app.application_date,
          app.deadline,
          app.status,
          app.priority,
          app.tags,
          app.resume_version_id,
          app.notes
        ]
      );
      appIds.push(r.insertId);
    }
    log('INFO', '8 high-impact applications inserted with priorities & tags');

    // ─── Insert Interview Rounds ───────────────────────────────────────────────
    // Google (Offer Received)
    await db.query(
      `INSERT INTO interview_rounds (application_id, round_name, round_date, questions_asked, topics_covered, difficulty, outcome, personal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appIds[0], 'Technical Screen (Coding)', dateOffset(38), 'Word Break II & Dynamic Programming on DAG', 'Dynamic Programming, Trie, Memoization', 'Medium', 'Cleared', 'Optimized time complexity from exponential to O(N^2) using memoized DFS.']
    );
    await db.query(
      `INSERT INTO interview_rounds (application_id, round_name, round_date, questions_asked, topics_covered, difficulty, outcome, personal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appIds[0], 'Technical Round 1 (DSA)', dateOffset(32), 'Sliding Window Maximum & Concurrent LRU Cache implementation', 'Queues, Deque, Mutex concurrency, Hash Map', 'Hard', 'Cleared', 'Interviewer praised clean modular code and handling of race conditions.']
    );
    await db.query(
      `INSERT INTO interview_rounds (application_id, round_name, round_date, questions_asked, topics_covered, difficulty, outcome, personal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appIds[0], 'Technical Round 2 (System Design)', dateOffset(24), 'Design Google Docs real-time collaborative editing engine (OT vs CRDT)', 'Distributed Systems, CRDTs, WebSockets, Redis pub/sub', 'Hard', 'Cleared', 'Detailed trade-offs between Operational Transformation and Conflict-Free Replicated Data Types.']
    );
    await db.query(
      `INSERT INTO interview_rounds (application_id, round_name, round_date, questions_asked, topics_covered, difficulty, outcome, personal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appIds[0], 'Googleyness & Leadership', dateOffset(16), 'Conflict resolution in engineering teams, navigating ambiguous technical roadmaps', 'STAR Behavioral, Ownership, Bias for Action', 'Easy', 'Cleared', 'Solid rapport with Senior Director of Engineering.']
    );

    // Stripe
    await db.query(
      `INSERT INTO interview_rounds (application_id, round_name, round_date, questions_asked, topics_covered, difficulty, outcome, personal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appIds[1], 'Technical Screen (Live Coding)', dateOffset(25), 'Idempotent Payment Processor API with retry mechanisms', 'API Design, Concurrency, Idempotency keys', 'Medium', 'Cleared', 'Built functional mock server with tests in 45 mins.']
    );

    // Microsoft
    await db.query(
      `INSERT INTO interview_rounds (application_id, round_name, round_date, questions_asked, topics_covered, difficulty, outcome, personal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appIds[2], 'Technical Round 1', dateOffset(22), 'Serialize and Deserialize Binary Tree, Inverted Index Search', 'Trees, Hashing, Information Retrieval', 'Medium', 'Cleared', 'Used pre-order BFS traversal with sentinel delimiters.']
    );

    log('INFO', 'Interview rounds seeded with comprehensive technical notes');

    // ─── Insert Reminders ─────────────────────────────────────────────────────
    const futureDate = (days, hours = 11) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      d.setHours(hours, 0, 0, 0);
      return d.toISOString().slice(0, 19).replace('T', ' ');
    };

    await db.query(
      `INSERT INTO reminders (user_id, application_id, title, reminder_type, remind_at, send_email, send_whatsapp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, appIds[1], 'Stripe Round 3 — Review Distributed Systems Architecture', 'Interview', futureDate(2, 10), 1, 1]
    );
    await db.query(
      `INSERT INTO reminders (user_id, application_id, title, reminder_type, remind_at, send_email, send_whatsapp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, appIds[5], 'Razorpay Online Assessment Window closes', 'OA', futureDate(3, 18), 1, 1]
    );
    await db.query(
      `INSERT INTO reminders (user_id, application_id, title, reminder_type, remind_at, send_email, send_whatsapp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, appIds[0], 'Google Compensation & Relocation Consultation', 'Offer Decision', futureDate(5, 15), 1, 1]
    );
    await db.query(
      `INSERT INTO reminders (user_id, application_id, title, reminder_type, remind_at, send_email, send_whatsapp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, appIds[6], 'Databricks Application Referral Follow-up', 'Referral Follow Up', futureDate(7, 12), 1, 0]
    );
    log('INFO', 'Upcoming smart reminders inserted');

    // ─── Insert Activity Logs ──────────────────────────────────────────────────
    const activityEntries = [
      `Added Google to high-priority pipeline`,
      `Advanced Google application to: Offer Received 🏆`,
      `Completed Technical Round 2 with Stripe`,
      `Ran AI ATS Resume Scorer for Atlassian (Match: 88%)`,
      `Generated AI Interview Prep kit for Uber Marketplace round`,
      `Added Databricks Systems Engineer to pipeline`,
    ];

    for (const action of activityEntries) {
      await db.query(
        'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
        [userId, action, 'application', appIds[0]]
      );
    }
    log('INFO', 'Activity timeline populated');

    log('INFO', '=====================================================');
    log('INFO', '🎉 HuntOS Database Seeding Complete!');
    log('INFO', '👤 Test Credentials:');
    log('INFO', '   Email:    niranjan@huntos.dev');
    log('INFO', '   Password: hunt123');
    log('INFO', '=====================================================');

    process.exit(0);
  } catch (err) {
    log('ERROR', `Seed failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
};

seed();
