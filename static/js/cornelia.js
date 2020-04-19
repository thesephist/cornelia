const {
    Component,
} = window.Torus;

const LOADED = 0,
    PLAYING = 1,
    GAME_END = 2;

function Loader() {
    return jdom`<div class="loader"></div>`;
}

class App extends Component {

    init() {
        this.state = LOADED;

        this.prompt = null;

        this.reset();
    }

    reset() {
        this.streakCorrect = 0;
        this.totalCorrect = 0;
        this.totalPlayed = 0;
    }

    correct() {
        this.streakCorrect ++;
        this.totalCorrect ++;
        this.totalPlayed ++;
    }

    incorrect() {
        this.streakCorrect = 0;
        this.totalPlayed ++;
    }

    async next() {
        this.prompt = null;
        this.render();

        const resp = await fetch('/line');
        this.prompt = await resp.json();
        this.render();
    }

    compose() {
        if (this.state === LOADED) {
            return jdom`<div>
                Cornelia Street
                <button onclick="${evt => {
                    this.state = PLAYING;
                    this.next();
                }}">Start</button>
            </div>`;
        }

        if (this.state === GAME_END) {
            return jdom`<div>Finished</div>`;
        }

        if (this.prompt === null) {
            // loading prompt
            return Loader();
        }

        const {
            line,
            title,
            choices,
        } = this.prompt;

        const Scoreboard = () => {
            return jdom`<div class="scoreboard accented block">
                <span>${this.totalCorrect}</span>
                /
                <span>${this.totalPlayed}</span>
            </div>`
        }

        const Choice = choiceTitle => {
            return jdom`<div class="choice block"
                onclick="${evt => {
                    if (choiceTitle === title) {
                        this.correct();
                    } else {
                        this.incorrect();
                    }
                    this.next();
                }}">
                ${choiceTitle}
            </div>`;
        }

        const allChoices = choices.concat(title);
        return jdom`<div>
            ${Scoreboard()}
            <div class="question">${line}</div>
            <div class="choices">${allChoices.map(t => Choice(t))}</div>
        </div>`;
    }

}

const app = new App();
document.getElementById('root').appendChild(app.node);
