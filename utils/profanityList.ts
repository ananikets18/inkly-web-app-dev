// A large, reusable profanity word list for filtering inappropriate language across the app
// Source: open-source lists, expanded for coverage

const PROFANITY_LIST: string[] = [
  // Common English profanity
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt", "piss", "crap", "damn", "slut", "whore",
  "fucker", "motherfucker", "bullshit", "douche", "douchebag", "jackass", "prick", "twat", "wank", "wanker",
  "arse", "arsehole", "bugger", "bollocks", "bloody", "git", "minger", "munter", "shag", "tosser", "twat",
  // Racial/ethnic slurs (for filtering, not for display)
  "chink", "gook", "kike", "spic", "wetback", "nigger", "negro", "coon", "jigaboo", "golliwog", "paki", "raghead",
  "sandnigger", "towelhead", "yid", "zipperhead",
  // Homophobic/transphobic slurs
  "fag", "faggot", "dyke", "tranny", "shemale", "homo", "queer", "lesbo",
  // Sexist/gendered slurs
  "skank", "slag", "tart", "tramp", "bimbo", "ho", "hoe", "hussy", "jezebel", "trollop",
  // Misc
  "jerk", "moron", "idiot", "imbecile", "retard", "spaz", "spastic", "dumbass", "dipshit", "shithead", "fuckhead",
  "numbnuts", "nutjob", "nutcase", "dickhead", "cock", "cockhead", "pussy", "pussies", "clit", "clitoris", "cum",
  "jizz", "jism", "spooge", "spooger", "wank", "wanker", "tosser", "bugger", "bollocks", "arse", "arsehole",
  // Add more as needed for your app's audience/language
];

export default PROFANITY_LIST;
