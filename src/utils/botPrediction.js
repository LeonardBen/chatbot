import stringSimilarity from 'string-similarity';

const bots = [
    { name: 'weather', keywords: ['weather', 'météo', 'meteo'] },
    { name: 'news', keywords: ['news', 'nouvelles', 'journaux'] },
    { name: 'chef', keywords: ['meal', 'plat', 'chef'] },
];

//Predict which bot is called
export function predictBot(userInput) {
    let bestMatchBot = 'unknown';
    let highestScore = 0;

    bots.forEach(bot => {
        bot.keywords.forEach(keyword => {
            const similarity = stringSimilarity.compareTwoStrings(userInput.toLowerCase(), keyword.toLowerCase());
            if (similarity > highestScore) {
                highestScore = similarity;
                bestMatchBot = bot.name;
            }
        });
    });

    return bestMatchBot;
}
