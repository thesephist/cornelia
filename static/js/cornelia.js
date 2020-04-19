const {
    Component,
} = window.Torus;

const LOADED = 0,
    PLAYING = 1;

const ANSWER_DELAY = 1200; // ms

function Loader() {
    return jdom`<div class="loader"></div>`;
}

class App extends Component {

    init() {
        this.state = LOADED;

        this.prompt = null;
        this.showAnswer = false;

        this.reset();
    }

    savePlayState() {
        window.localStorage.setItem('playState', JSON.stringify({
            sc: this.streakCorrect,
            tc: this.totalCorrect,
            tp: this.totalPlayed,
        }));
    }

    restorePlayState() {
        const playStateString = window.localStorage.getItem('playState');
        if (playStateString === null) {
            return;
        }

        try {
            const playState = JSON.parse(playStateString);
            this.streakCorrect = playState.sc;
            this.totalCorrect = playState.tc
            this.totalPlayed = playState.tp;
        } catch (e) {
            console.error(e);
            this.resetPlayState();
        }
    }

    resetPlayState() {
        window.localStorage.clear();
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
        this.showCorrectAnswer();
        this.savePlayState();

        setTimeout(this.next.bind(this), ANSWER_DELAY);
    }

    incorrect() {
        this.streakCorrect = 0;
        this.totalPlayed ++;
        this.showCorrectAnswer();
        this.savePlayState();

        setTimeout(this.next.bind(this), ANSWER_DELAY);
    }

    showCorrectAnswer() {
        this.showAnswer = true;
        this.render();
    }

    async next() {
        this.prompt = null;
        this.showAnswer = false;
        this.render();

        const resp = await fetch('/line');
        this.prompt = await resp.json();
        this.render();
    }

    compose() {
        if (this.state === LOADED) {
            return jdom`<div class="state--loaded">
                <a href="/">
                    <h1>1989.style</h1>
                </a>
                <p>Guess the correct Taylor Swift song from a line from the track!</p>
                <button class="block startButton"
                    onclick="${evt => {
                        this.state = PLAYING;
                        this.restorePlayState();

                        this.next();
                    }}">🎤 Start!</button>
                <p>
                    This project is <a href="https://github.com/thesephist/cornelia" target="_blank">open source</a>
                    and pulls from over 121 of Taylor Swift's singles, collaborations, and other chart-topping songs
                    across her amazing songwriting history.
                </p>
                <p class="right-align">
                    a project by <a href="https://thesephist.com" target="_blank">linus</a>
                </p>
            </div>`;
        }

        const Scoreboard = () => {
            return jdom`<div class="scoreboard">
                <div class="streak">
                    Streak
                    <div class="${this.streakCorrect ? 'accent' : ''} fixed block streakScoreboard">
                        🔥 ${this.streakCorrect}
                    </div>
                </div>
                <div class="totalScore">
                    Score
                    <div class="fixed block totalScoreboard">
                        <span>${this.totalCorrect}</span>
                        /
                        <span>${this.totalPlayed}</span>
                    </div>
                </div>
            </div>`
        }

        if (this.prompt === null) {
            // loading prompt
            return jdom`<div class="state--loading">
                ${Scoreboard()}
                <p class="loadingMessage">Loading next lyric...</p>
                <div class="loader"></div>
            </div>`;
        }

        const {
            line,
            title,
            choices,
        } = this.prompt;

        const Choice = choiceTitle => {
            const correct = this.showAnswer && choiceTitle === title;
            return jdom`<div class="${correct ? 'accent' : ''} choice block"
                onclick="${evt => {
                    if (choiceTitle === title) {
                        this.correct();
                    } else {
                        this.incorrect();
                    }
                }}">
                ${correct ? '✅' : ''}
                ${choiceTitle}
            </div>`;
        }

        const allChoices = choices.concat(title);
        return jdom`<div class="state--playing">
            ${Scoreboard()}
            <div class="lyric">${line}</div>
            <div class="choices">
                ${allChoices.map(t => Choice(t))}
                <div class="aux">
                    <button class="block startOverButton"
                        onclick="${evt => {
                            if (window.confirm('Restart quiz? You\'ll lose your progress.')) {
                                this.resetPlayState();
                                location.reload()
                            }
                        }}">
                        Start over
                    </button>
                    <p>
                        a project by <a href="https://thesephist.com" target="_blank">linus</a>
                    </p>
                </div>
            </div>
        </div>`;
    }

}

const app = new App();
document.getElementById('root').appendChild(app.node);
