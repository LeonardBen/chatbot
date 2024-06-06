export class BotList {
    constructor() {
        this.botContainer = document.querySelector('#botList');
        this.onBotSelect = null;
        this.init();
    }

    init() {
        this.botContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('bot')) {
                const botName = event.target.dataset.botName;
                if (this.onBotSelect) {
                    this.onBotSelect(botName);
                }
            }
        });
    }
}
