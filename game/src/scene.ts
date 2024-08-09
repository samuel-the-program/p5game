import P5 from "p5";
import GameObject from "./game-object.js"

export default class Scene {
    #setupCallback = () => {};
    #inputCallback = () => {};
    #updateCallback = () => {};
    #renderCallback = (_: number) => {};
    #children: GameObject[] = [];

    name = "";
    p5: P5;

    constructor(p5: P5, name: string) {
        this.p5 = p5;
        this.name = name;
    }

    createGameObject(name: string): GameObject {
        let go = new GameObject(this.p5, name);
        go.setParent(this);
        this.#children.push(go);
        return go;
    }

    removeChild(other: GameObject) {
        let i = this.#children.indexOf(other);
        if (i >= 0) {
            this.#children.splice(i, 1);
            other.setParent(undefined);
        }
    }

    getChild(name: string): GameObject | undefined {
        return this.#children.find(go => go.name === name);
    }

    onSetup(cb: () => void) {
        this.#setupCallback = cb;
    }
    onInput(cb: () => void) {
        this.#inputCallback = cb;
    }
    onUpdate(cb: () => void) {
        this.#updateCallback = cb;
    }
    onRender(cb: (lag: number) => void) {
        this.#renderCallback = cb;
    }

    setup() {
        this.#setupCallback();
    }
    handleInput() {
        this.#inputCallback();
        for (let go of this.#children) {
            if (go.getParent() === this) {
                go.handleInput();
            }
        }
    }
    update() {
        this.#updateCallback();
        for (let go of this.#children) {
            if (go.getParent() === this) {
                go.update();
            }
        }
    }
    render(lag: number) {
        this.#renderCallback(lag);
        for (let go of this.#children) {
            if (go.getParent() === this) {
                go.render(lag);
            }
        }
    }

    report() {
        console.log(`Scene ${this.name}:`);
        for (let go of this.#children) {
            go.report();
        }
    }
}