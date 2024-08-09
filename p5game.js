import Game from "./game/build/game.js"
import Scene from "./game/build/scene.js"
import GameObject from "./game/build/game-object.js"
import {TransformComponent, SpriteComponent} from "./game/build/component.js"

export const P5Game = {
    Game: Game,
    Scene: Scene,
    GameObject: GameObject,
    TransformComponent: TransformComponent,
    SpriteComponent: SpriteComponent
};