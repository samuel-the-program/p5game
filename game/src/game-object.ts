import P5 from "p5";
import * as C from "./component.js";
import Scene from "./scene.js";

export default class GameObject {
    #inputCallback = () => {};
    #updateCallback = () => {};
    #renderCallback = (lag: number) => {};
    #children: GameObject[] = [];
    #components: C.Component[] = [];
    #parent: GameObject | Scene | undefined;

    p5: P5;
    name: string;

    constructor(p5: P5, name: string) {
        this.p5 = p5;
        this.name = name;
    }

    createComponent(type: C.CompType): C.Component {
        let c = C.createComponent(type, this.p5);
        c.setParent(this);
        this.#components.push(c);
        return c;
    }

    hasComponent(type: string): boolean {
        return this.#components.some(x => x.getType() === type);
    }

    getComponent(type: string): C.Component | undefined {
        return this.#components.find(x => x.getType() === type);
    }

    addChild(other: GameObject) {
        this.#children.push(other);
        if (other.#parent !== undefined) {
            other.#parent.removeChild(other);
        }
        other.#parent = this;
    }

    removeChild(other: GameObject) {
        let i = this.#children.indexOf(other);
        if (i >= 0) {
            this.#children.splice(i, 1);
            other.#parent = undefined;
        }
    }

    getChild(name: string): GameObject | undefined {
        return this.#children.find(go => go.name === name);
    }

    getParent(): GameObject | Scene | undefined {
        return this.#parent;
    }

    setParent(p: GameObject | Scene | undefined)  {
        this.#parent = p;
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

    handleInput() {
        this.#inputCallback();
        for (let go of this.#children) {
            go.handleInput();
        }
    }

    update() {
        this.#updateCallback();
        for (let go of this.#children) {
            go.update();
        }
    }

    render(lag: number) {
        let func = (lag: number) => {
            this.#renderCallback(lag);
            for (let go of this.#children) {
                go.render(lag);
            }
        };
        let s = this.getComponent("sprite") as C.SpriteComponent;
        let t = this.getComponent("transform") as C.TransformComponent;

        if (s !== undefined) {
            func = s.renderImage(func);
        }

        if (t !== undefined) {
            func = t.applyTransform(func);
        }

        func(lag);
    }

    report() {
        console.log(`${this.name} -> ${this.#components.map(c => c.getType()).join(", ")}`);
        for (let go of this.#children) {
            go.report();
        }
    }
}