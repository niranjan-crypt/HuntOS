// ============================================
// HuntOS AI Controller (Powered by Gemini)
// Engineered by Niranjan Krishnakumar
// ============================================

const callGemini = async (prompt, systemInstruction = '') => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your .env');
  }

  const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash-lite'];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text;
      }

      const errText = await response.text();
      lastError = new Error(`Gemini ${model} error (${response.status}): ${errText}`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to reach Gemini API models');
};

// ─── 1. EXTRACT JOB DETAILS (FastClip Extension & Web Clipper) ─────────────
const extractDetails = async (req, res) => {
  try {
    const { content, title, url } = req.body;

    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: 'Content and title are required for extraction',
      });
    }

    const prompt = `You are an elite career intelligence parser for HuntOS. Extract job, internship, or hackathon details from the webpage content below.
Return ONLY a valid, raw JSON object without markdown fences or additional commentary.

Required JSON Structure:
{
  "company_name": "company or organizer name",
  "role": "job title or internship role or hackathon title",
  "location": "City, Country, Remote, or Hybrid (or null)",
  "package": "Salary, CTC, or stipend as a string (or null)",
  "deadline": "Application deadline formatted as YYYY-MM-DD (or null)",
  "type": "One of: Job / Internship / Hackathon / OA / Fellowship",
  "priority": "High / Medium / Low",
  "tags": "Comma-separated tags e.g. 'Remote, SDE, Product' (or 'Full-Time')",
  "application_link": "${url || ''}"
}

Page Title: ${title}
Page Content:
${content.slice(0, 12000)}`;

    let text = await callGemini(prompt);
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let extractedData;
    try {
      extractedData = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        extractedData = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    return res.status(200).json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error('[HuntOS AI] Extraction Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error extracting job details',
    });
  }
};

// ─── 2. AI INTERVIEW PREP COPILOT ──────────────────────────────────────────
const generateInterviewPrep = async (req, res) => {
  try {
    const { company_name, role, round_name, topics, difficulty } = req.body;

    if (!company_name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company name and role are required to generate prep questions',
      });
    }

    const prompt = `You are a Principal Tech Interview Coach at HuntOS.
Create a hyper-targeted interview preparation kit for:
- Company: ${company_name}
- Role: ${role}
- Target Round: ${round_name || 'Technical Round'}
- Focus Topics: ${topics || 'DSA, System Design, Core CS'}
- Difficulty Target: ${difficulty || 'Medium'}

Return ONLY a valid JSON object matching this schema exactly without markdown formatting:
{
  "company_overview": "2 sentences on what ${company_name} looks for in engineers",
  "technical_questions": [
    {
      "question": "Question text",
      "concept": "Specific DSA or architectural concept",
      "approach_hint": "Key algorithmic approach or insight"
    }
  ],
  "behavioral_questions": [
    {
      "question": "Behavioral question tailored to company values",
      "star_tip": "How to structure the response using STAR method"
    }
  ],
  "insider_tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}`;

    let text = await callGemini(prompt);
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let prepData;
    try {
      prepData = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        prepData = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse AI interview prep data');
      }
    }

    return res.status(200).json({
      success: true,
      data: prepData,
    });
  } catch (error) {
    console.error('[HuntOS AI] Interview Prep Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating interview prep kit',
    });
  }
};

// ─── 3. RESUME ATS SCORE & REVIEWER ────────────────────────────────────────
const reviewResumeATS = async (req, res) => {
  try {
    const { resume_text, job_description, role, company_name } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({
        success: false,
        message: 'Both resume text and job description are required for ATS evaluation',
      });
    }

    const prompt = `You are an elite Applicant Tracking System (ATS) evaluator and Technical Recruiter.
Analyze this resume against the target job description:
Role: ${role || 'Software Engineer'}
Company: ${company_name || 'Tech Company'}

Target Job Description:
${job_description.slice(0, 5000)}

Candidate Resume Content:
${resume_text.slice(0, 5000)}

Evaluate the match. Return ONLY a valid JSON object with:
{
  "ats_score": 85,
  "match_level": "High Match / Moderate Match / Low Match",
  "summary": "Concise 2-sentence executive summary of candidacy fit",
  "matched_skills": ["skill1", "skill2", "skill3"],
  "missing_keywords": ["keyword1", "keyword2", "keyword3"],
  "impact_improvements": [
    {
      "original": "Weak or generic phrase from resume",
      "suggested": "Action-oriented, quantified rewrite using Google XYZ formula (Accomplished [X], as measured by [Y], by doing [Z])"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    let text = await callGemini(prompt);
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let reviewData;
    try {
      reviewData = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        reviewData = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse ATS evaluation result');
      }
    }

    return res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error('[HuntOS AI] ATS Review Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error evaluating resume ATS match',
    });
  }
};

// ─── 4. COVER LETTER GENERATOR ─────────────────────────────────────────────
const generateCoverLetter = async (req, res) => {
  try {
    const { company_name, role, candidate_name, candidate_skills, job_description } = req.body;

    const prompt = `Write a modern, punchy, non-cliché cover letter for ${candidate_name || 'the candidate'} applying for the ${role} position at ${company_name}.
Highlight these key strengths: ${candidate_skills || 'Full-stack engineering, algorithms, problem solving'}.
Job Context: ${job_description ? job_description.slice(0, 1500) : 'Standard engineering position'}.

Rules:
- Keep it under 250 words.
- Avoid robotic corporate clichés ("I am writing to express my enthusiasm").
- Sound authentic, driven, and results-focused.
- Output plain markdown text only.`;

    const letter = await callGemini(prompt);

    return res.status(200).json({
      success: true,
      data: { cover_letter: letter.trim() },
    });
  } catch (error) {
    console.error('[HuntOS AI] Cover Letter Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating cover letter',
    });
  }
};

module.exports = {
  extractDetails,
  generateInterviewPrep,
  reviewResumeATS,
  generateCoverLetter,
};
