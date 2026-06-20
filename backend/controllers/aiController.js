import Student from '../models/Student.js';

// AI Resume Analyzer
export const analyzeResume = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const skills = student.skills || [];
    const projects = student.projects || [];
    const experience = student.experience || [];
    const certifications = student.certifications || [];

    // Calculate simulated ATS score based on criteria:
    // Resume formatting, keywords (skills), projects details, contact info
    let formattingScore = 20; // default for uploading a PDF
    if (!student.resumeUrl) formattingScore = 0;

    const keywordScore = Math.min(skills.length * 8, 40); // Max 40% for skills keywords
    const experienceScore = Math.min((experience.length * 10) + (projects.length * 5), 30); // Max 30%
    const credentialsScore = Math.min(certifications.length * 5, 10); // Max 10%

    const atsScore = formattingScore + keywordScore + experienceScore + credentialsScore;

    // Detect missing skills (compare to popular technical skills)
    const hotTechSkills = ['react', 'node.js', 'express', 'mongodb', 'docker', 'typescript', 'aws', 'python', 'sql', 'git'];
    const studentSkillsLower = skills.map((s) => s.toLowerCase().trim());
    const missingSkills = hotTechSkills.filter((s) => !studentSkillsLower.includes(s));

    // Compile resume suggestions
    const suggestions = [];
    if (!student.resumeUrl) {
      suggestions.push('Upload your resume PDF in the dashboard to enable detailed ATS analysis.');
    }
    if (skills.length < 5) {
      suggestions.push('Add at least 5-8 relevant core technical skills to optimize search indexing.');
    }
    if (projects.length < 2) {
      suggestions.push('Include at least 2 detailed projects. Use the STAR method: Situation, Task, Action, Result.');
    }
    if (!experience || experience.length === 0) {
      suggestions.push('Describe any internship, freelance work, or freelance roles to demonstrate practical work experience.');
    }
    if (student.cgpa < 7.5) {
      suggestions.push('Focus on building strong open-source contributions or competitive coding profiles to offset CGPA restrictions.');
    }

    res.json({
      atsScore,
      rating: atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Improvement',
      missingSkills: missingSkills.slice(0, 4),
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Placement Chance Predictor
export const predictPlacement = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const { cgpa, backlogs, skills, projects, certifications } = student;

    // Formula to predict chances (realistic weighting):
    // CGPA contributes 40 points
    let cgpaScore = 0;
    if (cgpa >= 9) cgpaScore = 40;
    else if (cgpa >= 8) cgpaScore = 35;
    else if (cgpa >= 7) cgpaScore = 30;
    else if (cgpa >= 6) cgpaScore = 20;
    else cgpaScore = 10;

    // Backlogs deduct points
    const backlogPenalty = backlogs * 12;

    // Skills contribute 25 points
    const skillsScore = Math.min((skills?.length || 0) * 4, 25);

    // Projects contribute 20 points
    const projectsScore = Math.min((projects?.length || 0) * 8, 20);

    // Certifications contribute 15 points
    const certificationsScore = Math.min((certifications?.length || 0) * 5, 15);

    let placementChance = cgpaScore - backlogPenalty + skillsScore + projectsScore + certificationsScore;

    // Clamp score between 5% and 98%
    placementChance = Math.max(5, Math.min(placementChance, 98));

    // Provide feedback descriptions based on score range
    let analysis = '';
    let recommendation = [];

    if (placementChance >= 80) {
      analysis = 'Strong candidate profile. You have excellent credentials and high placement likelihood.';
      recommendation.push('Focus on advanced coding practices and system design patterns.', 'Prepare for HR interviews by framing answers using the STAR format.', 'Apply to dream tier companies (12+ LPA).');
    } else if (placementChance >= 55) {
      analysis = 'Moderate candidate profile. You are highly eligible, but strengthening your portfolio will lock in top offers.';
      recommendation.push('Acquire at least 2 premium industry-recognized certifications.', 'Add a full-stack project utilizing modern databases and hosting services.', 'Revise DSA fundamentals, focusing on Arrays, Strings, and Trees.');
    } else {
      analysis = 'Low placement probability under current criteria. Profile requires immediate additions.';
      recommendation.push('Clear any active backlogs as priority, as they trigger TPO and recruiter filters.', 'Participate in hackathons or open-source programs to build practical skills.', 'Build 1 robust, deployed project to demonstrate practical engineering.');
    }

    res.json({
      probability: placementChance,
      analysis,
      recommendation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI Chatbot Assistant
export const chatAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const query = message.toLowerCase().trim();
  let reply = '';

  // Simple, highly comprehensive FAQ response dictionary
  if (query.includes('ats') || query.includes('resume')) {
    reply = `To improve your resume's ATS score, follow these core guidelines:
1. **Formatting**: Avoid multi-column grids or custom graphical diagrams. Use standard chronological layouts.
2. **Keywords**: Scan the target job description and inject core keywords (like Node.js, Redux, PostgreSQL) directly into your Skills section.
3. **Action Verbs**: Start each bullet point under work experience or projects with a strong action verb (e.g. "Developed", "Optimized", "Architected").
4. **Metrics**: Quantify achievements (e.g. "Reduced application load time by 30%").
You can upload your resume to the **AI Resume Analyzer** tool on the left sidebar to obtain an exact ATS check!`;
  } else if (query.includes('interview') || query.includes('prepare') || query.includes('preparation')) {
    reply = `Here is a 3-step structured interview preparation plan:
1. **Technical Prep**: Master Data Structures and Algorithms (specifically arrays, maps, recursion, and dynamic programming). For Web Development, understand JS closures, async programming, and API patterns.
2. **Behavioral Prep (TCS/Infosys/Google/etc.)**: Use the STAR method (Situation, Task, Action, Result) to explain project challenges.
3. **System Design**: For higher tier jobs, study how horizontal scaling, load balancers, caching, and rate limiting function in production.`;
  } else if (query.includes('eligibility') || query.includes('tpo') || query.includes('cgpa')) {
    reply = `Campus placement eligibility is managed by the Training & Placement Officer (TPO). Typically:
- Most premium recruiters filter students by **CGPA (usually >= 7.0 or 7.5)**.
- Candidates with **active backlogs** are often disqualified from early campus drives.
- Eligibility status can be toggled by the TPO in the admin portal. You can view your current placement eligibility status in your Profile dashboard.`;
  } else if (query.includes('salary') || query.includes('package') || query.includes('lpa')) {
    reply = `On the placement portal:
- Salary packages are listed in **LPA (Lakhs Per Annum)**.
- Recruiters post salaries ranging from mass recruiter packages (3.5 - 6 LPA) to product tier packages (10 - 25+ LPA).
- The TPO dashboard aggregates the college's highest and average packages in real time!`;
  } else {
    reply = `Hello! I am your AI Placement Assistant. I can help you with:
- **Resume Guidance & ATS optimization tips**
- **Interview preparation roadmaps**
- **Portal usage and TPO Eligibility queries**
Feel free to ask questions like:
- "How do I optimize my resume for ATS?"
- "What should I study for technical interviews?"
- "How are placement eligibility conditions computed?"`;
  }

  // Simulate thinking delay
  setTimeout(() => {
    res.json({ reply });
  }, 300);
};
