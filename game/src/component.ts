import P5 from "p5";
import GameObject from "./game-object.js"

type CompType = "none" | "transform" | "sprite";
type RenderCallback = (lag: number) => void;

class Component {
    #parent: GameObject | undefined;
    p5: P5;

    constructor(p5: P5, parent?: GameObject) {
        this.p5 = p5;
        this.#parent = parent;
    }

    setParent(go: GameObject) {
        this.#parent = go;
    }

    getParent(): GameObject | undefined {
        return this.#parent;
    }

    getType(): CompType {
        return "none";
    }
}

class TransformComponent extends Component {
    pos: P5.Vector;
    rot: number;
    scl: P5.Vector;

    constructor(p5: P5, parent?: GameObject) {
        super(p5, parent);
        this.pos = p5.createVector(0, 0);
        this.rot = 0;
        this.scl = p5.createVector(1, 1);
    }

    applyTransform(cb: RenderCallback): RenderCallback {
        return (lag: number) => {
            this.p5.translate(this.pos);
            this.p5.rotate(this.rot);
            this.p5.scale(this.scl);
            cb(lag);
        }
    }

    getType(): CompType {
        return "transform";
    }
}

class SpriteComponent extends Component {
    image: P5.Image | undefined;
    scaleX: number = 1;
    scaleY: number = 1;

    constructor(p5: P5, parent?: GameObject, image?: P5.Image) {
        super(p5, parent);
        this.image = image;
    }

    setImage(image: P5.Image) {
        this.image = image;
    }

    setScale(sclX: number, sclY?: number) {
        this.scaleX = sclX;
        this.scaleY = sclY || sclX;
    }

    renderImage(cb: RenderCallback): RenderCallback {
        return (lag: number) => {
            if (this.image !== undefined) {
                let w = this.image.width * this.scaleX;
                let h = this.image.height * this.scaleY;

                this.p5.image(this.image, -w/2, -h/2, w, h);
            }
            cb(lag);
        }
    }

    getType(): CompType {
        return "sprite";
    }
}

function createComponent(type: CompType, p5: P5) {
    switch (type) {
        case "transform":
            return new TransformComponent(p5);
        case "sprite":
            return new SpriteComponent(p5);
        default:
            return new Component(p5);
    }
}

export {Component, 
    CompType,
    RenderCallback,
    TransformComponent, 
    SpriteComponent, 
    createComponent
}