//Load message from localStorage
export function loadMessages() {
    const messages = localStorage.getItem('chatMessages');
    return messages ? JSON.parse(messages) : [];
}

//Save message in localStorage
export function saveMessage(message) {
    const messages = loadMessages();
    messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

//Clear content of localStorage
export function clearLocalStorage() {
    localStorage.clear();
}

//Clear chatMesage
export function clearChatMessages() {
    const messagesContainer = document.querySelector('#messages');
    while (messagesContainer.firstChild) {
        messagesContainer.removeChild(messagesContainer.firstChild);
    }
}