import { getMealById } from '../api/chefAPI';
import { Commands } from '../utils/commands';
import { saveMessage } from '../utils/localStorage';
import { predictBot } from '../utils/botPrediction';

export class Chat {
    constructor() {
        this.chatContainer = document.querySelector('#messages');
        this.commands = new Commands();
    }

    //Format user input
    formatResponse(response) {
        return {
            message: response.message || response,
            images: response.images || (response.image ? [response.image] : []),
            meals: response.meals || []
        };
    }

    //Get user local time to display in chat
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    //Get user bot picture
    getBotImage(botName) {
        const botImages = {
            'Weather Bot': './src/assets/Picture_weather_bot.webp',
            'News Bot': './src/assets/Picture_news_bot.webp',
            'Chef Bot': './src/assets/Picture_chef_bot.webp',
            'Helper Bot': './src/assets/Picture_helper_bot.webp'
        };
        return botImages[botName] || '';
    }

    //Create all HTML structure
    addMessage({ userInput, response, botName, animate = false }) {
        const formattedResponse = this.formatResponse(response);
        const currentTime = this.getCurrentTime();

        const userMessageContainer = document.createElement('div');
        userMessageContainer.classList.add('message-container', 'user-message-container');

        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.textContent = `You: ${userInput}`;
        userMessageContainer.appendChild(userMessageElement);

        const userTimeElement = document.createElement('div');
        userTimeElement.classList.add('message-time');
        userTimeElement.textContent = currentTime;
        userMessageContainer.appendChild(userTimeElement);

        this.chatContainer.appendChild(userMessageContainer);

        const botMessageContainer = document.createElement('div');
        botMessageContainer.classList.add('message-container', 'bot-message-container');

        const botProfileAndMessageContainer = document.createElement('div');
        botProfileAndMessageContainer.classList.add('bot-profil-message-container');

        const botImageElement = document.createElement('img');
        botImageElement.src = this.getBotImage(botName);
        botImageElement.alt = `${botName} Image`;
        botProfileAndMessageContainer.appendChild(botImageElement);

        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('message', 'bot-message');
        botProfileAndMessageContainer.appendChild(botMessageElement);
        botMessageContainer.appendChild(botProfileAndMessageContainer);

        const botTimeElement = document.createElement('div');
        botTimeElement.classList.add('message-time');
        botTimeElement.textContent = currentTime;
        botMessageContainer.appendChild(botTimeElement);

        this.chatContainer.appendChild(botMessageContainer);

        if (animate) {
            // Show the bot message letter by letter
            this.typeText(botMessageElement, `${botName}: ${formattedResponse.message}`);
        } else {
            botMessageElement.innerHTML = `${botName}: ${formattedResponse.message}`;
        }

        if (formattedResponse.images.length > 0 || formattedResponse.meals.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('meal-images');

            formattedResponse.images.forEach((imageUrl) => {
                const botImageElement = document.createElement('img');
                botImageElement.classList.add('message', 'bot-image');
                botImageElement.src = imageUrl;
                botImageElement.alt = 'Image';
                imagesContainer.appendChild(botImageElement);
            });

            formattedResponse.meals.forEach(meal => {
                const mealContainer = document.createElement('div');
                mealContainer.classList.add('meal-container');

                const mealNameElement = document.createElement('div');
                mealNameElement.classList.add('message', 'bot-message');
                mealNameElement.textContent = `${meal.name}`;
                mealContainer.appendChild(mealNameElement);

                const mealImageElement = document.createElement('img');
                mealImageElement.classList.add('message', 'bot-image');
                mealImageElement.src = meal.thumb;
                mealImageElement.alt = 'Image';
                mealContainer.appendChild(mealImageElement);

                const recipeButton = document.createElement('button');
                recipeButton.classList.add('recipe-button');
                recipeButton.textContent = 'View Recipe';
                recipeButton.addEventListener('click', async () => {
                    const recipeResponse = await getMealById(meal.id);
                    this.addMessage({ userInput: `Recipe for ${meal.name}`, response: recipeResponse, botName, animate: true });
                });
                mealContainer.appendChild(recipeButton);

                imagesContainer.appendChild(mealContainer);
            });

            this.chatContainer.appendChild(imagesContainer);
        }

        this.chatContainer.scrollTop = this.chatContainer.scrollHeight; // Scroll to the bottom
    }

    //Animate bot typing
    typeText(element, text) {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                if (text[index] === '<') {//Balise checker
                    const endIndex = text.indexOf('>', index);
                    if (endIndex !== -1) {
                        element.innerHTML += text.substring(index, endIndex + 1);
                        index = endIndex + 1;
                    } else {
                        element.innerHTML += text[index];
                        index++;
                    }
                } else {
                    element.innerHTML += text[index];
                    index++;
                }
            } else {
                clearInterval(interval);
            }
        }, 20);
    }

    //Sendmessage and save message in localStorage
    sendMessage = async (userInput, chat) => {
        const userInputValue = userInput.value.trim();
        if (!userInputValue) return;

        let response;
        let botName = 'Bot';

        if (userInputValue.toLowerCase() === 'help') {
            response = this.commands.getHelpResponse();
            botName = 'Helper Bot';
        } else if (userInputValue.toLowerCase() === 'hello') {
            const helloResponses = this.commands.getHelloResponses(userInputValue);
            helloResponses.forEach(msg => {
                chat.addMessage({ ...msg, animate: true });
                saveMessage(msg);
            });
            userInput.value = '';
            return;
        } else {
            const predictedBot = predictBot(userInputValue);
            const result = await this.commands.handlePredictiveCommand(predictedBot, userInputValue);
            response = result.response;
            botName = result.botName;
        }

        const message = { userInput: userInputValue, response, botName };
        chat.addMessage({ ...message, animate: true });
        saveMessage(message);

        userInput.value = '';
    };
}