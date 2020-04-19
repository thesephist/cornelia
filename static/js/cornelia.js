const {
    Component,
} = window.Torus;

class App extends Component {

    compose() {
        return jdom`<div class="app">
            Cornelia Street
        </div>`;
    }

}

const app = new App();
document.getElementById('root').appendChild(app.node);
