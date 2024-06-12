import { getWeather, getUVIndex, getWeatherForecast } from '../api/weatherAPI';
import { getNewsByCountry, getNewsByCategory, getNewsByQuery } from '../api/newsAPI';
import { getRandomMeal, getMealByIngredient } from '../api/chefAPI';


export class Commands {
    //Help commands
    getHelpResponse = () => {
        return {
            message: 'Available commands:<br>' +
                '<br>1. Weather Bot:<br>' +
                '   - "weather [city]": Get current weather for a city.<br>' +
                '   - "weather uv [city]": Get UV index for a city.<br>' +
                '   - "weather forecast [city]": Get 7-day weather forecast for a city.<br>' +
                '<br>2. News Bot:<br>' +
                '   - "news country [country]": Get news by country.<br>' +
                '   - "news category [category]": Get news by category.<br>' +
                '   - "news query [query]": Get news by search query.<br>' +
                '<br>3. Chef Bot:<br>' +
                '   - "meal random": Get a random meal suggestion.<br>' +
                '   - "meal ingredient [ingredient]": Get meals by ingredient.<br>' +
                '   - "meal area [area]": Get meals by area.<br>' +
                '   - "recipe [meal id]": Get recipe by meal ID.'
        };
    };

    //Hello commands for trigger all bot
    getHelloResponses = (userInputValue) => {
        return [
            { userInput: userInputValue, response: { message: 'Hello! I am Weather Bot. How can I assist you with weather information today?' }, botName: 'Weather Bot' },
            { userInput: userInputValue, response: { message: 'Hello! I am News Bot. Looking for the latest news?' }, botName: 'News Bot' },
            { userInput: userInputValue, response: { message: 'Hello! I am Chef Bot. Ready to cook something delicious today?' }, botName: 'Chef Bot' },
            { userInput: userInputValue, response: { message: 'Hello! I am Helper Bot. Type help if you are lost' }, botName: 'Helper Bot' }
        ];
    };

    //Predict commands and use BotPrediction
    handlePredictiveCommand = async (predictedBot, userInputValue) => {
        let response;
        let botName = predictedBot.charAt(0).toUpperCase() + predictedBot.slice(1) + ' Bot';

        try {
            switch (predictedBot) {
                case 'weather':
                    if (userInputValue.toLowerCase().includes('uv')) {
                        const cityUV = userInputValue.split(' ').slice(2).join(' ');
                        response = await getUVIndex(cityUV);
                    } else if (userInputValue.toLowerCase().includes('forecast')) {
                        const cityForecast = userInputValue.split(' ').slice(2).join(' ');
                        response = await getWeatherForecast(cityForecast);
                    } else {
                        const city = userInputValue.split(' ').slice(1).join(' ');
                        response = await getWeather(city);
                    }
                    break;
                case 'news':
                    const newsInput = userInputValue.split(' ').slice(1).join(' ');
                    if (newsInput.toLowerCase().startsWith('category')) {
                        const category = newsInput.split(' ').slice(1).join(' ');
                        response = await getNewsByCategory(category);
                    } else if (newsInput.toLowerCase().startsWith('country')) {
                        const country = newsInput.split(' ').slice(1).join(' ');
                        response = await getNewsByCountry(country);
                    } else {
                        response = await getNewsByQuery(newsInput);
                    }
                    break;
                case 'chef':
                    if (userInputValue.toLowerCase().includes('ingredient')) {
                        const ingredient = userInputValue.split(' ').slice(2).join(' ');
                        response = await getMealByIngredient(ingredient);
                    } else {
                        response = await getRandomMeal();
                    }
                    break;
                default:
                    response = { message: 'Sorry, I did not understand your request.', images: [] };
            }
        } catch (error) {
            console.error(`Error fetching data:`, error);
            response = { message: 'Error fetching data. Please try again later.', images: [] };
        }

        return { response, botName };
    };

}

