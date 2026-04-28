// Caption + Hashtag Controller — upgraded templates, Tamil support, better variety

const CAPTION_TEMPLATES = {
  motivational: [
    "Every step forward is a step toward something bigger. Keep going! 💪 {topic}",
    "Success is not final, failure is not fatal — what matters is the courage to continue. ✨ {topic}",
    "Dream big, work hard, stay humble. 🌟 {topic}",
    "The only limit is the one you set yourself. Break free. 🔥 {topic}",
    "Small progress is still progress. Keep going — your future self will thank you. 🙌 {topic}",
    "You didn't come this far to only come this far. Push harder. 💥 {topic}",
    "Discipline beats motivation every single time. Show up, do the work. ⚡ {topic}",
    "Hard days are the best days because they make you stronger. 🏆 {topic}",
    "Believe in yourself before anyone else does. That's where it all starts. 🌱 {topic}",
    "Action is the antidote to fear. Start before you're ready. 🚀 {topic}",
  ],
  product: [
    "Introducing something you didn't know you needed — until now. 🛍️ {topic}",
    "Quality meets style. Discover the difference. ✨ {topic}",
    "Why settle for ordinary when extraordinary is one click away? 🔥 {topic}",
    "This isn't just a product — it's a game changer. 👀 {topic}",
    "Crafted for those who demand the best. No compromises. 💎 {topic}",
    "Your search ends here. {topic} — exactly what you've been looking for. 🎯",
    "Real people. Real results. Experience the difference. ⭐ {topic}",
    "Because you deserve only the best. Treat yourself. 🎁 {topic}",
    "From our hands to yours — made with love. ❤️ {topic}",
    "Limited stock. Unlimited style. Grab yours before it's gone. ⏰ {topic}",
  ],
  lifestyle: [
    "This is the life. ☀️ {topic} | Make every moment count.",
    "Good vibes only. 🌿 Living my best life. {topic}",
    "Collect moments, not things. 📸 {topic}",
    "Life's too short for boring routines. Shake it up. ✨ {topic}",
    "Less scrolling, more living. Here's to the good stuff. 🥂 {topic}",
    "Creating a life I love, one moment at a time. 💫 {topic}",
    "Not just a lifestyle — it's a whole vibe. 🌙 {topic}",
    "Choose joy. Every single day. 🌸 {topic}",
    "Living simply, loving deeply, giving generously. 🤍 {topic}",
    "The best is yet to come — and it starts today. 🌅 {topic}",
  ],
  business: [
    "Growth mindset. Results driven. 📈 {topic}",
    "Building something meaningful, one day at a time. 💼 {topic}",
    "The future belongs to those who prepare for it today. 🚀 {topic}",
    "Work smarter, scale faster, impact deeper. 🎯 {topic}",
    "Behind every successful business is a team that refused to quit. 💪 {topic}",
    "Don't just run a business — build a legacy. 👑 {topic}",
    "Your vision + execution = unstoppable results. 🔨 {topic}",
    "Opportunities don't happen. You create them. 💡 {topic}",
    "Every expert was once a beginner. Start before you're ready. 🌱 {topic}",
    "What got you here won't get you there. Keep evolving. 📊 {topic}",
  ],
  food: [
    "Life is short — eat the good stuff. 🍽️ {topic}",
    "Food is culture, community, and love. ❤️ {topic}",
    "Good food = good mood. 😋 {topic}",
    "Every bite tells a story. This one? Pure perfection. 🤤 {topic}",
    "Chef's kiss doesn't even begin to cover it. 😘👌 {topic}",
    "Warning: This content may cause serious cravings. 😍 {topic}",
    "Eating well is a form of self-respect. 🥗 {topic}",
    "Made from scratch, made with love. 👨‍🍳 {topic}",
    "First, eat well. Then, conquer the world. 🍜 {topic}",
    "Food tastes better when shared. Who's coming over? 🍕 {topic}",
  ],
  tamil: [
    "வாழ்க்கை ஒரு பயணம், ஒவ்வொரு நாளும் ஒரு புதிய அத்தியாயம். ✨ {topic}",
    "கனவு கண்டால் மட்டும் போதாது, அதை நோக்கி உழைக்கணும். 💪 {topic}",
    "தோல்வி என்பது வெற்றிக்கான படிக்கட்டு மட்டுமே. 🌟 {topic}",
    "நம்பிக்கையோடு முன்னேறுங்கள், வெற்றி நிச்சயம். 🚀 {topic}",
    "சின்ன சின்ன அடிகளே பெரிய இலக்கை அடையச் செய்யும். 🎯 {topic}",
    "அன்பே சக்தி, அது உலகை மாற்றும். ❤️ {topic}",
    "இன்றே தொடங்கு, நாளை காத்திருக்காதே. ⚡ {topic}",
    "மனித உறவுகளே வாழ்வின் மிகப்பெரிய செல்வம். 🤝 {topic}",
  ],
}

const HASHTAG_SETS = {
  general: {
    high:   ['#viral','#trending','#instagood','#photooftheday','#love','#instagram'],
    medium: ['#happy','#beautiful','#follow','#like','#amazing','#fun','#smile','#cool'],
    low:    ['#dailypost','#contentcreator','#authenticlife','#realmoments','#everyday'],
  },
  business: {
    high:   ['#entrepreneur','#business','#startup','#marketing','#success'],
    medium: ['#motivation','#leadership','#innovation','#growth','#hustle','#ceo','#mindset'],
    low:    ['#smallbusiness','#businessowner','#buildingempire','#sidehustle','#workhard'],
  },
  lifestyle: {
    high:   ['#lifestyle','#life','#fashion','#beauty','#fitness'],
    medium: ['#wellness','#mindset','#selfcare','#positivity','#travel','#inspo'],
    low:    ['#slowliving','#intentionalliving','#dailyinspiration','#authenticself'],
  },
  tech: {
    high:   ['#technology','#tech','#innovation','#ai','#coding'],
    medium: ['#programming','#developer','#software','#digital','#future','#startup'],
    low:    ['#techlife','#devlife','#opensource','#machinelearning','#buildinpublic'],
  },
  food: {
    high:   ['#foodie','#food','#foodphotography','#yummy','#delicious'],
    medium: ['#recipe','#homemade','#cooking','#instafood','#eat','#hungry','#tasty'],
    low:    ['#homecook','#foodblogger','#eeeeeats','#feedfeed','#foodstagram'],
  },
  fitness: {
    high:   ['#fitness','#gym','#workout','#health','#fit'],
    medium: ['#motivation','#training','#healthy','#bodybuilding','#exercise','#gains'],
    low:    ['#fitfam','#fitnessjourney','#healthylifestyle','#nopainnogain','#gymlife'],
  },
  travel: {
    high:   ['#travel','#wanderlust','#adventure','#explore','#vacation'],
    medium: ['#travelphotography','#holiday','#trip','#nature','#tourism','#instatravel'],
    low:    ['#travelgram','#traveladdict','#solotravel','#travelblogger','#wanderer'],
  },
  tamil: {
    high:   ['#tamil','#tamilmotivation','#tamilquotes','#tamilstatus'],
    medium: ['#tamilinsta','#tamilan','#tamilpeople','#tamilnadu','#chennaidiaries'],
    low:    ['#tamilentrepreneur','#tamilbusiness','#tamillifestyle','#kollywood'],
  },
}

// ── Caption endpoint ─────────────────────────────────────────────
const generateCaptions = (req, res) => {
  try {
    const { topic = '', tone = 'motivational', count = 3 } = req.body
    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a topic' })
    }

    const templates = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.motivational
    const shuffled = [...templates].sort(() => Math.random() - 0.5)
    const captions = shuffled
      .slice(0, Math.min(parseInt(count), 5))
      .map(t => t.replace(/{topic}/g, topic.trim()))

    res.json({ success: true, data: { captions, tone, topic } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── Hashtag endpoint ──────────────────────────────────────────────
const generateHashtags = (req, res) => {
  try {
    const { topic = '', niche = 'general', count = 20 } = req.body
    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a topic' })
    }

    const sets = HASHTAG_SETS[niche] || HASHTAG_SETS.general
    const topicTags = topic.trim().toLowerCase().split(/\s+/)
      .filter(w => w.length > 2)
      .map(w => `#${w.replace(/[^a-z0-9]/g, '')}`)
      .filter(Boolean)

    const allHigh   = [...sets.high]
    const allMedium = [...sets.medium]
    const allLow    = [...sets.low, ...topicTags]

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

    const n = Math.min(parseInt(count) || 20, 30)
    const highCount   = Math.min(5,  allHigh.length)
    const medCount    = Math.min(10, allMedium.length)
    const lowCount    = Math.min(n - highCount - medCount, allLow.length)

    const high   = shuffle(allHigh).slice(0, highCount)
    const medium = shuffle(allMedium).slice(0, medCount)
    const low    = shuffle(allLow).slice(0, lowCount)

    const total = high.length + medium.length + low.length

    res.json({
      success: true,
      data: {
        high, medium, low,
        total,
        all: [...high, ...medium, ...low].join(' '),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { generateCaptions, generateHashtags }
