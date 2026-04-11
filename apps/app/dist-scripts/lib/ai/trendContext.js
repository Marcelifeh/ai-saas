"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicContext = getDynamicContext;
// server-only removed for script runtime
const SEASONS = {
    0: 'Winter', 1: 'Winter', 2: 'Spring',
    3: 'Spring', 4: 'Spring', 5: 'Summer',
    6: 'Summer', 7: 'Summer', 8: 'Fall',
    9: 'Fall', 10: 'Fall', 11: 'Winter'
};
const UPCOMING_HOLIDAYS_BY_MONTH = {
    0: "Valentine's Day, Super Bowl",
    1: "St. Patrick's Day, Spring Break",
    2: "Easter, Earth Day",
    3: "Mother's Day, Memorial Day, Graduations",
    4: "Father's Day, Pride Month, Summer Vacations",
    5: "4th of July, Summer Travel",
    6: "Back to School, Late Summer",
    7: "Halloween Prep, Fall Vibes",
    8: "Halloween, Oktoberfest",
    9: "Thanksgiving, Black Friday",
    10: "Christmas, Hanukkah, Winter Holidays",
    11: "New Year's, Winter Sports"
};
const TREND_ANGLES = [
    "Pickleball addictions", "Bouldering & climbing culture", "Cozy gaming & Stardew Valley vibes",
    "BookTok & spicy romance readers", "Urban gardening & plant parenthood", "Slow running clubs & amateur marathons",
    "Sourdough baking & homesteading", "Board game cafe enthusiasts", "Thrifting & vintage fashion hunters",
    "Analog photography & film cameras",
    "Quiet luxury aesthetic", "Girl dinner & chaotic cooking", "ADHD hyperfocus & neurodivergent pride",
    "Late night coders & tech burnout humor", "Corporate girlie survival", "Gym rat energy & lifting culture",
    "Elder emo nostalgic millennials", "Feral girl summer & unapologetic living", "ASMR & satisfying textures",
    "Overstimulated teachers", "Exhausted nurses and healthcare workers", "Freelance hustle culture & remote work isolation",
    "Barista struggles & coffee addiction", "Hair stylists & beauty pros",
    "DINK (Dual Income No Kids) pet parents", "Reptile & obscure pet keepers", "Van life & digital nomads",
    "Introvert reloading mode", "Social battery management"
];
const TRENDING_SEARCH_TOPICS = [
    "pickleball", "girl dinner", "gym rats", "booktok", "quiet luxury",
    "cozy gaming", "feral girl summer", "homesteading",
    "neurospicy", "plant killer", "introvert energy", "true crime podcasts"
];
function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
function getDynamicContext() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const season = SEASONS[month] || "Unknown";
    const upcoming = UPCOMING_HOLIDAYS_BY_MONTH[month] || "None";
    const angles = getRandomItems(TREND_ANGLES, 2);
    const searchTopics = getRandomItems(TRENDING_SEARCH_TOPICS, 3);
    return `Time Context: Today is ${monthName} ${year}. 
Season: ${season}. 
Upcoming themes/holidays usually sourcing designs right now: ${upcoming}.

Trend Injection: Focus on emerging internet culture and micro-communities.
Base your generation on these randomized starter angles:
- ${angles.join('\n- ')}

Recent viral search behaviors observed: ${searchTopics.join(', ')}.

Avoid generic classics (like basic dog moms, coffee lovers, gamers). Provide novel, high-converting, highly specific modern niches.`;
}
