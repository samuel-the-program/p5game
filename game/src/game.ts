import P5 from "p5";
import Scene from "./scene.js"

export default class Game {
    static allGames: Game[] = [];

    #lastTime: number = new Date().valueOf();
    #currentTime: number = new Date().valueOf();
    #lag = 0;
    #currentScene: Scene | undefined;
    #scenes: Scene[] = [];
    #images: { [s: string]: P5.Image; } = {};
    #unloadedImages: { [s: string]: string; } = {};

    updateTimestep = 1/50;
    maxUpdates = 60;
    p5: P5;
    constructor(p5: P5, scenes?: Scene[], updateTimestep: number=1/50) {
        this.p5 = p5;
        if (scenes !== undefined) {
            for (let s of scenes) {
                this.addScene(s);
            }
            this.#currentScene = scenes[0];
        }
        this.updateTimestep = updateTimestep;
        Game.allGames.push(this);
    }

    createScene(name: string): Scene {
        let s = new Scene(this.p5, name);
        this.#scenes.push(s);
        return s;
    }

    addScene(scene: Scene) {
        this.#scenes.push(scene);
    }

    getScene(name: string): Scene | undefined {
        return this.#scenes.find(s => s.name === name);
    }

    setCurrentScene(name: string) {
        this.#currentScene = this.getScene(name);
    }

    getCurrentScene(): Scene | undefined {
        return this.#currentScene;
    }

    addImage(name: string, src: string) {
        this.#unloadedImages[name] = src;
    }

    loadImages() {
        for (let name in this.#unloadedImages) {
            this.#images[name] = this.p5.loadImage(this.#unloadedImages[name]);
        }
        this.#unloadedImages = {};
    }

    getImage(name: string): P5.Image {
        return this.#images[name];
    }

    setup() {
        this.#lastTime = new Date().valueOf();
        for (let name in this.#scenes) {
            this.#scenes[name].setup();
        }
    }

    gameLoop() {
        this.#currentTime = new Date().valueOf();
        let elapsed = (this.#currentTime - this.#lastTime)/1000;
        this.#lastTime = this.#currentTime;
        this.#lag += elapsed;

        if (!this.#currentScene) return;
        this.#currentScene.handleInput(); // keyIsDown()
        let iterations = 0;
        while (this.#lag >= this.updateTimestep && iterations < this.maxUpdates) {
            this.#currentScene.update();
            this.#lag -= this.updateTimestep;
            iterations++;
        }

        this.#currentScene.render(Math.min(this.#lag / this.updateTimestep, 1));
    }

    report() {
        console.log(`Game:`);
        for (let s in this.#scenes) {
            this.#scenes[s].report();
        }
    }
}