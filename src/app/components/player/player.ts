import { TransformNode, Scene, Vector3, AbstractMesh, Axis, Space, Color4, ParticleSystem, GPUParticleSystem } from '@babylonjs/core';
import Utils from '@common/utils';
import { InputService } from '@services/input.service';
import { ParticleService } from '@services/particle.service';
import { ParticleTrailModel } from '@models/particle-trail.model';
import { ModelService } from '@services/model.service';



export class Player extends TransformNode {

    private mesh: AbstractMesh;
    private scene: Scene;

    private zVel = 0;
    private maxZVel: number;

    private yRot = 0;
    private maxYRot: number;

    private xRot = 0;
    private maxXRot: number;

    private maxZRot: number;

    private lEng: ParticleSystem | GPUParticleSystem;
    private rEng: ParticleSystem | GPUParticleSystem;

    public readonly PITCH_TILT = new Vector3(Utils.degreesToRads(15), 0, 0);
    private readonly TRAIL_COLOR = new Color4(0.3, 1, 0.4, 1);

    constructor(
        scene: Scene,
        maxZVel: number,
        maxYRot: number,
        maxZRot: number,
        maxXRot: number,
        private input: InputService,
        private particle: ParticleService,
        private model: ModelService
    ) {
        super('player', scene );
        this.scene = scene;
        this.maxZVel = maxZVel;
        this.maxYRot = maxYRot;
        this.maxZRot = maxZRot;
        this.maxXRot = maxXRot;
        this.mesh = scene.getMeshByID('player');
        this.mesh.setParent(this);
        this.initEngineTrails();
    }

    public get playerMesh(): AbstractMesh {
        return this.mesh;
    }

    public get joystickPressed(): boolean {
        return this.input.lJoystickPressed() /* || this.input.rJoystickPressed()*/;
    }

    public get tPressed(): boolean {
        return this.input.keyPressed(' ') /* || this.joystickPressed*/;
    }

    public get lPressed(): boolean {
        return this.input.keyPressed('a') /* || this.joystickPressed*/;
    }

    public get rPressed(): boolean {
        return this.input.keyPressed('d') /* || this.joystickPressed*/;
    }

    public get uPressed(): boolean {
        return this.input.keyPressed('s') /* || this.joystickPressed*/;
    }

    public get dPressed(): boolean {
        return this.input.keyPressed('w') /* || this.joystickPressed*/;
    }

    // public joystickThrust(thrustRate: number) {
    //     if (this.input.lJoystickPressed()) {
    //         this.thrust(this.input.lJoystick.deltaPosition.y * (this.scene.getEngine().getDeltaTime()/1000) * thrustRate);
    //     }

    //     if (this.input.rJoystickPressed()) {
    //         this.thrust(-(this.input.rJoystick.deltaPosition.y / 1000000));
    //     }
    // }

    // public joystickTurn() {
    //     if (this.input.lJoystickPressed()) {
    //         this.turnLeft(this.input.rJoystick.deltaPosition.x / 1000000);
    //         this.turnRight(this.input.rJoystick.deltaPosition.x / 1000000);
    //     }

    //     if (this.input.rJoystickPressed()) {
    //         this.turnLeft(this.input.rJoystick.deltaPosition.x / 1000000);
    //         this.turnRight(this.input.rJoystick.deltaPosition.x / 1000000);
    //     }
    // }

    public thrust(distancePerSec: number) {
        if (this.tPressed) {
            this.zVel += distancePerSec / this.scene.getEngine().getFps();
            if (this.zVel > this.maxZVel) {
                this.zVel = this.maxZVel;
            }
            this.translate(Axis.Z, this.zVel, Space.LOCAL);
        } else {
            this.zVel -= distancePerSec / this.scene.getEngine().getFps();
            if (this.zVel < 0) {
                this.zVel = 0;
            }
            this.translate(Axis.Z, this.zVel, Space.LOCAL);
        }
    }

    public pitchDown(pitchRate: number) {
        if (this.dPressed) {

            if (this.xRot + (pitchRate / this.scene.getEngine().getFps()) > this.maxXRot) {
                this.xRot = +this.maxXRot;
            } else {
                this.xRot += pitchRate / this.scene.getEngine().getFps();
            }
            this.rotation.x += this.xRot;

        } else if (!this.input.keyPressed('s')) {
            if (this.xRot > 0) {
                if (this.xRot - (pitchRate / this.scene.getEngine().getFps()) < 0) {
                    this.xRot = 0;
                } else {
                    this.xRot -= pitchRate / this.scene.getEngine().getFps();
                }
                this.rotation.x += this.xRot;
            }
        }
    }

    public pitchUp(pitchRate: number) {
        if (this.uPressed) {

            if (this.xRot - (pitchRate / this.scene.getEngine().getFps()) < -this.maxXRot) {
                this.xRot = -this.maxXRot;
            } else {
                this.xRot -= pitchRate / this.scene.getEngine().getFps();
            }
            this.rotation.x += this.xRot;

        } else if (!this.input.keyPressed('w')) {
            if (this.xRot < 0) {
                if (this.xRot + (pitchRate / this.scene.getEngine().getFps()) > 0) {
                    this.xRot = 0;
                } else {
                    this.xRot += pitchRate / this.scene.getEngine().getFps();
                }
                this.rotation.x += this.xRot;
            }
        }
    }

    public turnLeft(yawRate: number, rollRate: number) {
        if(this.lPressed) {

            if (this.yRot - (yawRate / this.scene.getEngine().getFps()) < -this.maxYRot) {
                this.yRot = -this.maxYRot;
            } else {
                this.yRot -= yawRate / this.scene.getEngine().getFps();
            }
            this.rotation.y += this.yRot;


            if (this.rotation.z + (rollRate / this.scene.getEngine().getFps()) > this.maxZRot) {
                this.rotation.z = this.maxZRot;
            } else {
                this.rotation.z += rollRate / this.scene.getEngine().getFps();
            }
        } else if (!this.input.keyPressed('d')) {
            if (this.yRot < 0) {
                if (this.yRot + (yawRate / this.scene.getEngine().getFps()) > 0) {
                    this.yRot = 0;
                } else {
                    this.yRot += yawRate / this.scene.getEngine().getFps();
                }
                this.rotation.y += this.yRot;
            }

            if (this.rotation.z > 0) {
                if (this.rotation.z - (rollRate / this.scene.getEngine().getFps()) < 0) {
                    this.rotation.z = 0;
                } else {
                    this.rotation.z -= rollRate / this.scene.getEngine().getFps();
                }
            }
        }
    }

    public turnRight(yawRate: number, rollRate: number) {
        if(this.rPressed) {
            if (this.yRot + (yawRate / this.scene.getEngine().getFps()) > this.maxYRot) {
                this.yRot = this.maxYRot;
            } else {
                this.yRot += yawRate / this.scene.getEngine().getFps();
            }
            this.rotation.y += this.yRot;

            if (this.rotation.z - (rollRate / this.scene.getEngine().getFps()) < -this.maxZRot) {
                this.rotation.z = -this.maxZRot;
            } else {
                this.rotation.z -= rollRate / this.scene.getEngine().getFps();
            }
        } else if (!this.input.keyPressed('a')) {
            if (this.yRot > 0) {
                if (this.yRot - (yawRate / this.scene.getEngine().getFps()) < 0) {
                    this.yRot = 0;
                } else {
                    this.yRot -= yawRate / this.scene.getEngine().getFps();
                }
                this.rotation.y += this.yRot;
            }

            if (this.rotation.z < 0) {
                if (this.rotation.z + (rollRate / this.scene.getEngine().getFps()) > 0) {
                    this.rotation.z = 0;
                } else {
                    this.rotation.z += rollRate / this.scene.getEngine().getFps();
                }
            }
        }
    }

    public toggleTrails() {
        if (this.tPressed) {
            this.lEng.start();
            this.rEng.start();
        } else {
            this.lEng.stop();
            this.rEng.stop();
        }
    }

    public initEngineTrails() {
        this.lEng = this.particle.createParticleTrail(this.scene, new ParticleTrailModel({
            name: 'lEng',
            minEmitBox: new Vector3(-0.03, -0.01, -0.3),
            maxEmitBox: new Vector3(-0.07, 0.01, -0.4),
            pTextureUrl: 'assets/textures/plane_trail/plane_trail.jpg',
            direction1: new Vector3(0, Utils.degreesToRads(0), 0),
            direction2: new Vector3(0, Utils.degreesToRads(0), 0),
            color1: this.TRAIL_COLOR,
            color2: this.TRAIL_COLOR,
            colorDead: new Color4(0, 0, 0, 0),
            emitRate: 1000,
            minLifeTime: 0.2,
            maxLifeTime: 0.4,
            minSize: 0.001,
            maxSize: 0.03,
            minEmitPower: 1,
            maxEmitPower: 3,
            updateSpeed: 0.001,
            emitter: this.scene.getMeshByID('player'),
            gpuCap: 2000,
            cpuCap: 2000
        }));

        this.rEng = this.particle.createParticleTrail(this.scene, new ParticleTrailModel({
            name: 'rEng',
            minEmitBox: new Vector3(0.03, -0.01, -0.3),
            maxEmitBox: new Vector3(0.07 , 0.01, -0.4),
            pTextureUrl: 'assets/textures/plane_trail/plane_trail.jpg',
            direction1: new Vector3(0, Utils.degreesToRads(0), 0),
            direction2: new Vector3(0, Utils.degreesToRads(0), 0),
            color1: this.TRAIL_COLOR,
            color2: this.TRAIL_COLOR,
            colorDead: new Color4(0, 0, 0, 0),
            emitRate: 1000,
            minLifeTime: 0.2,
            maxLifeTime: 0.4,
            minSize: 0.001,
            maxSize: 0.03,
            minEmitPower: 1,
            maxEmitPower: 3,
            updateSpeed: 0.001,
            emitter: this.scene.getMeshByID('player'),
            gpuCap: 2000,
            cpuCap: 2000
        }));
    }

    public moveGuns() {
        this.model.rotateMesh(
            this.scene,
            'leftGun',
            new Vector3(0, 1, 1),
            3,
            this.scene.getEngine().getFps()
        );
    }
}
