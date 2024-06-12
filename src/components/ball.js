const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];


function createBalls(container, numBalls) {
    const balls = [];

    for (let i = 0; i < numBalls; i++) {
        let ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.background = colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = `${Math.random() * 100}%`;
        ball.style.top = `${Math.random() * 100}%`;
        ball.style.transform = `scale(${Math.random()})`;
        ball.style.width = `${Math.random() * 4 + 1}em`;
        ball.style.height = ball.style.width;

        balls.push(ball);
        container.append(ball);
    }

    balls.forEach((el, i) => {
        let to = {
            x: Math.random() * (i % 2 === 0 ? -11 : 11),
            y: Math.random() * 12
        };

        el.animate(
            [
                { transform: "translate(0, 0)" },
                { transform: `translate(${to.x}rem, ${to.y}rem)` }
            ],
            {
                duration: (Math.random() + 1) * 2000,
                direction: "alternate",
                fill: "forwards",
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );
    });
}

const chatBackgroundContainer = document.getElementById('chatBackgroundContainer');
const botBackgroundContainer = document.getElementById('botBackgroundContainer');

createBalls(chatBackgroundContainer, 50);
createBalls(botBackgroundContainer, 15);
