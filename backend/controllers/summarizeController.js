const natural = require('natural');

const summarizeText = (req, res) => {
  try {
    const { text, ratio = 0.3 } = req.body;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Text too short to summarize' });
    }

    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text.trim());

    if (sentences.length < 2) {
      return res.status(400).json({ success: false, message: 'Need at least 2 sentences to summarize' });
    }

    // TF-IDF scoring
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    sentences.forEach(s => tfidf.addDocument(s));

    const scores = sentences.map((sentence, i) => {
      let score = 0;
      tfidf.listTerms(i).forEach(term => { score += term.tfidf; });

      // Position boost: first and last sentences carry more weight (journalistic pyramid)
      if (i === 0) score *= 1.5;
      if (i === sentences.length - 1) score *= 1.2;

      // Length penalty: very short sentences (< 5 words) are less informative
      const wordCount = sentence.split(/\s+/).length;
      if (wordCount < 5) score *= 0.5;

      return { sentence, score, index: i };
    });

    const numSentences = Math.max(1, Math.round(sentences.length * parseFloat(ratio)));
    const selected = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentences)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence);

    const summary = selected.join(' ');
    const compressionRatio = ((1 - summary.split(/\s+/).length / text.split(/\s+/).length) * 100).toFixed(1);

    // Extract key phrases
    const wordTokenizer = new natural.WordTokenizer();
    const words = wordTokenizer.tokenize(text.toLowerCase());
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','that','this','these','those','i','you','he','she','we','they','it','its','their','our','your','his','her','also','just','can','not','more','about']);
    const freqMap = {};
    words.forEach(w => {
      if (!stopWords.has(w) && w.length > 3) freqMap[w] = (freqMap[w] || 0) + 1;
    });
    const keywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word]) => word);

    // Reading time estimate
    const wordsPerMin = 200;
    const originalReadTime = Math.ceil(text.split(/\s+/).length / wordsPerMin);
    const summaryReadTime = Math.ceil(summary.split(/\s+/).length / wordsPerMin);

    res.json({
      success: true,
      data: {
        summary,
        keywords,
        originalWordCount: text.split(/\s+/).length,
        summaryWordCount: summary.split(/\s+/).length,
        compressionRatio: parseFloat(compressionRatio),
        originalReadTime,
        summaryReadTime,
        sentenceCount: selected.length,
      },
    });
  } catch (err) {
    console.error('Summarize error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { summarizeText };
