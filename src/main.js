import { Chat } from './components/chat';
import { loadMessages, clearLocalStorage, clearChatMessages } from './utils/localStorage';

const commands = [
    'help',
    'hello',
    'weather',
    'weather forecast',
    'weather uv',
    'news country',
    'news category',
    'news query',
    'meal random',
    'meal ingredient',
    'meal area'
];

// Delete localStorage
document.querySelector('#deleteChat').addEventListener('click', () => {
    clearLocalStorage();
    clearChatMessages();
});

document.addEventListener('DOMContentLoaded', () => {
    const chat = new Chat();
    const botList = document.querySelectorAll('.bot');
    const userInput = document.querySelector('#userInput');
    const commandList = document.querySelector('#commands');
    const sendButton = document.querySelector('#sendButton');

    // Restore chat history from localStorage
    loadMessages().forEach(msg => chat.addMessage({ ...msg, animate: false }));

    botList.forEach(bot => {
        bot.addEventListener('click', () => {
            userInput.value = bot.textContent;
        });
    });

    // Update suggestions in datalist
    userInput.addEventListener('input', () => {
        const value = userInput.value.toLowerCase();
        commandList.innerHTML = '';
        commands
            .filter(command => command.includes(value))
            .forEach(command => {
                const option = document.createElement('option');
                option.value = command;
                commandList.appendChild(option);
            });
    });

    //Send message with button or enter key
    sendButton.addEventListener('click', () => chat.sendMessage(userInput, chat));
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            chat.sendMessage(userInput, chat);
        }
    });
});