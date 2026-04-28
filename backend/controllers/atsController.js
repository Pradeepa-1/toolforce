const natural = require('natural');
const path = require('path');
const fs = require('fs');

const ATS_KEYWORDS = {
  technical: ['javascript','python','react','node','sql','aws','docker','kubernetes','git','api','rest','graphql','mongodb','postgresql','typescript','java','c++','machine learning','data analysis','agile','scrum'],
  soft: ['leadership','communication','teamwork','problem solving','analytical','creative','detail oriented','time management','collaboration','adaptability','initiative','strategic'],
  action: ['developed','managed','led','created','implemented','designed','built','improved','increased','reduced','optimized','analyzed','collaborated','delivered','achieved'],
  format: ['experience','education','skills','projects','summary','objective','certifications','achievements','responsibilities','accomplishments'],
};

// ─── Extract text from uploaded PDF or DOCX ───────────────────────────────
async function extractTextFromFile(filePath, mimetype, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  // PDF extraction
  if (mimetype === 'application/pdf' || ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(buffer);
    return parsed.text;
  }

  // DOCX extraction
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === '.docx'
  ) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  // Legacy .doc — try mammoth anyway (may fail on old binary format)
  if (mimetype === 'application/msword' || ext === '.doc') {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
}

// ─── Core ATS scoring logic (shared by both endpoints) ────────────────────
function scoreResume(resumeText, jobDescription = '') {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Keyword scoring
  const results = {};
  let totalScore = 0;
  let maxScore = 0;

  Object.entries(ATS_KEYWORDS).forEach(([category, keywords]) => {
    const found = keywords.filter(kw => resumeLower.includes(kw));
    const score = Math.round((found.length / keywords.length) * 25);
    results[category] = { found, missing: keywords.filter(k => !found.includes(k)), score };
    totalScore += score;
    maxScore += 25;
  });

  // JD keyword match
  let jdMatch = [];
  let jdMissing = [];
  if (jobDescription.trim()) {
    const tokenizer = new natural.WordTokenizer();
    const jdWords = [...new Set(tokenizer.tokenize(jdLower).filter(w => w.length > 4))];
    jdMatch = jdWords.filter(w => resumeLower.includes(w)).slice(0, 20);
    jdMissing = jdWords.filter(w => !resumeLower.includes(w)).slice(0, 15);
  }

  // Format checks
  const wordCount = resumeText.split(/\s+/).length;
  const formatChecks = [
    { label: 'Contact information present', pass: /\b[\w.]+@[\w.]+\.\w+\b/.test(resumeText) || /\b\d{10}\b/.test(resumeText) },
    { label: 'Resume length adequate (200+ words)', pass: wordCount >= 200 },
    { label: 'Uses bullet points or dashes', pass: resumeText.includes('•') || resumeText.includes('-') || resumeText.includes('*') },
    { label: 'Contains measurable achievements', pass: /\d+%|\$\d+|\d+\+/.test(resumeText) },
    { label: 'Has key sections (Experience, Skills, Education)', pass: /experience/i.test(resumeText) && /skills/i.test(resumeText) && /education/i.test(resumeText) },
  ];

  const formatScore = Math.round((formatChecks.filter(c => c.pass).length / formatChecks.length) * 20);
  totalScore += formatScore;
  maxScore += 20;

  const finalScore = Math.round((totalScore / maxScore) * 100);

  let grade = 'Poor';
  if (finalScore >= 80) grade = 'Excellent';
  else if (finalScore >= 65) grade = 'Good';
  else if (finalScore >= 50) grade = 'Average';
  else if (finalScore >= 35) grade = 'Below Average';

  return {
    score: finalScore,
    grade,
    categoryScores: results,
    formatChecks,
    jdMatch,
    jdMissing,
    suggestions: generateSuggestions(results, formatChecks, finalScore),
  };
}

function generateSuggestions(results, formatChecks, score) {
  const suggestions = [];
  if (results.action.found.length < 5) suggestions.push('Add more action verbs (developed, managed, led, implemented)');
  if (results.technical.found.length < 3) suggestions.push('Include relevant technical skills matching the job description');
  if (!formatChecks[3].pass) suggestions.push('Add quantifiable achievements (e.g., increased revenue by 30%)');
  if (!formatChecks[0].pass) suggestions.push('Ensure contact information is clearly visible');
  if (results.soft.found.length < 3) suggestions.push('Incorporate soft skills relevant to the role');
  if (!formatChecks[4].pass) suggestions.push('Add clearly labeled sections: Experience, Skills, and Education');
  if (score < 65) suggestions.push('Tailor your resume specifically to the job description keywords');
  return suggestions;
}

// ─── Route: POST /api/ats  (plain text) ───────────────────────────────────
const checkATS = (req, res) => {
  try {
    const { resumeText, jobDescription = '' } = req.body;
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ success: false, message: 'Resume text too short (min 100 characters)' });
    }
    const data = scoreResume(resumeText, jobDescription);
    res.json({ success: true, data });
  } catch (err) {
    console.error('ATS text error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Route: POST /api/ats/upload  (PDF / DOCX) ────────────────────────────
const checkATSFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { path: filePath, mimetype, originalname } = req.file;
    const jobDescription = req.body.jobDescription || '';

    let resumeText;
    try {
      resumeText = await extractTextFromFile(filePath, mimetype, originalname);
    } finally {
      // Always clean up the uploaded file
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from this file. Please ensure the document contains selectable text (not a scanned image).',
      });
    }

    const data = scoreResume(resumeText, jobDescription);
    // Include character count so frontend can show "X chars extracted"
    data.extractedChars = resumeText.trim().length;

    res.json({ success: true, data });
  } catch (err) {
    console.error('ATS file error:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { checkATS, checkATSFile };
