const countryCodes = {
    "france": "fr",
    "united states": "us",
    "united kingdom": "gb",
    "germany": "de",
    "spain": "es"
};

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export async function getNewsByCountry(country) {
    const countryCode = countryCodes[country.toLowerCase()];
    if (!countryCode) {
        return 'Invalid country name. Please use the full country name.';
    }
    try {

        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=${countryCode}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results.length === 0) {
            return 'No news articles found.';
        }
        return data.results.slice(0, 5).map(article => `${article.title} - ${article.source_id}`).join('\n');
    } catch (error) {
        console.error('Failed to fetch news data:', error);
        return 'Failed to fetch news data.';
    }
}


const categories = [
    "business",
    "entertainment",
    "environment",
    "food",
    "health",
    "politics",
    "science",
    "sports",
    "technology",
    "top",
    "world"
];

export async function getNewsByCategory(category) {
    if (!categories.includes(category.toLowerCase())) {
        return 'Invalid category. Please use one of the following categories: business, entertainment, environment, food, health, politics, science, sports, technology, top, world.';
    }
    try {
        const url = `https://newsdata.io/api/1/news?apikey=pub_4589157f6b2384fe18b15bae99bbc066081d8&category=${category.toLowerCase()}&country=fr`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results.length === 0) {
            return 'No news articles found.';
        }
        return data.results.slice(0, 5).map(article => `${article.title} - ${article.source_id}`).join('\n');
    } catch (error) {
        console.error('Failed to fetch news data:', error);
        return 'Failed to fetch news data.';
    }
}


export async function getNewsByQuery(query) {
    if (!query) {
        return 'Please provide a valid query.';
    }
    try {
        const url = `https://newsdata.io/api/1/news?apikey=pub_4589157f6b2384fe18b15bae99bbc066081d8&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results.length === 0) {
            return 'No news articles found.';
        }
        return data.results.slice(0, 5).map(article => `${article.title} - ${article.source_id}`).join('\n');
    } catch (error) {
        console.error('Failed to fetch news data:', error);
        return 'Failed to fetch news data.';
    }
}
