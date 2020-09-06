import { TransformNode, Scene, Vector3, AbstractMesh, Axis, Space, Color4, ParticleSystem, GPUParticleSystem } from '@babylonjs/core';
import Utils from '@common/utils';
import { InputService } from '@services/input.service';
import { ParticleService } from '../../services/particle.service';
import { ParticleTrailModel } from '@models/particle-trail.model';
import { ModelService } from '@services/model.service';

export class Player extends TransformNode {

    private mesh: AbstractMesh;
    private scene: Scene;

    private zVel = 0;
    private maxZVel: number;

    private yRot = 0;
    private maxYRot: number;

    private zRot = 0;
    private maxZRot: number;

    private lEng: ParticleSystem | GPUParticleSystem;
    private rEng: ParticleSystem | GPUParticleSystem;

    public readonly PITCH_TILT = new Vector3(Utils.degreesToRads(15), 0, 0);

    constructor(
        scene: Scene,
        maxZVel: number,
        maxYRot: number,
        maxZRot: number,
        private input: InputService,
        private particle: ParticleService,
        private model: ModelService
    ) {
        super('player', scene );
        this.scene = scene;
        this.maxZVel = maxZVel;
        this.maxYRot = maxYRot;
        this.maxZRot = maxZRot;
        this.mesh = scene.getMeshByID('player');
        this.mesh.setParent(this);
        this.initEngineTrails();
    }

    public get playerMesh(): AbstractMesh {
        return this.mesh;
    }

    public thrust(zRate: number) {
        if(this.input.keyPressed('w')) {
            this.zVel += zRate;
            if (this.zVel > this.maxZVel) {
                this.zVel = this.maxZVel;
            }
            this.translate(Axis.Z, this.zVel, Space.LOCAL);
        } else {
            this.zVel -= zRate;
            if(this.zVel < 0) {
                this.zVel = 0;
            }
            this.translate(Axis.Z, this.zVel, Space.LOCAL);
        }
    }

    public turnLeft(yRotRate: number) {
        if(this.input.keyPressed('a')) {
            this.yRot -= yRotRate;
            if (this.yRot < -this.maxYRot) {
                this.yRot = -this.maxYRot;
            }
            this.rotation.y += this.yRot;
        } else {
            this.nullTurn(yRotRate);
        }
    }

    public rollLeft () {

    }

    public turnRight(yRotRate: number) {
        if(this.input.keyPressed('d')) {
            this.yRot += yRotRate;
            if (this.yRot > this.maxYRot) {
                this.yRot = this.maxYRot;
            }
            this.rotation.y += this.yRot;
        } else {
            this.nullTurn(yRotRate);
        }
    }

    public rollRight() {

    }

    public nullTurn(yRotRate: number) {
        if (!this.input.keyPressed('a') && !this.input.keyPressed('d') && this.yRot !== 0) {
            if(this.yRot > 0) {
                this.yRot -= yRotRate;
                this.rotation.y += this.yRot;
            } else if (this.yRot < 0) {
                this.yRot += yRotRate;
                this.rotation.y += this.yRot;
            }

            if (this.yRot < 0.00001 || this.yRot > -0.00001) {
                this.yRot = 0;
            }
        }
    }

    public toggleTrails() {
        if (this.input.keyPressed('w')) {
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
            minEmitBox: new Vector3(0, 1.3, 0),
            maxEmitBox: new Vector3(0, -1.3, 0),
            pTextureUrl: 'assets/textures/plane_trail/plane_trail.jpg',
            direction1: new Vector3(0, Utils.degreesToRads(0), 0),
            direction2: new Vector3(0, Utils.degreesToRads(0), 0),
            color1: new Color4(0, 0.4, 1, 1),
            color2: new Color4(1, 0.4, 0, 1),
            colorDead: new Color4(0, 0, 0, 0),
            emitRate: 1000,
            minLifeTime: 0.2,
            maxLifeTime: 0.4,
            minSize: 0.001,
            maxSize: 0.03,
            minEmitPower: 1,
            maxEmitPower: 3,
            updateSpeed: 0.001,
            emitter: this.scene.getMeshByID('left_engine'),
            gpuCap: 2000,
            cpuCap: 2000
        }));

        this.rEng = this.particle.createParticleTrail(this.scene, new ParticleTrailModel({
            name: 'rEng',
            minEmitBox: new Vector3(0, 1.3, 0),
            maxEmitBox: new Vector3(0, -1.3, 0),
            pTextureUrl: 'assets/textures/plane_trail/plane_trail.jpg',
            direction1: new Vector3(0, Utils.degreesToRads(0), 0),
            direction2: new Vector3(0, Utils.degreesToRads(0), 0),
            color1: new Color4(0, 0.4, 1, 1),
            color2: new Color4(1, 0.4, 0, 1),
            colorDead: new Color4(0, 0, 0, 0),
            emitRate: 1000,
            minLifeTime: 0.2,
            maxLifeTime: 0.4,
            minSize: 0.001,
            maxSize: 0.03,
            minEmitPower: 1,
            maxEmitPower: 3,
            updateSpeed: 0.001,
            emitter: this.scene.getMeshByID('right_engine'),
            gpuCap: 2000,
            cpuCap: 2000
        }));
    }

    public animateEngines() {
        this.model.rotateMesh(
            this.scene,
            'left_engine',
            new Vector3(0, 1, 1),
            3,
            this.scene.getEngine().getFps()
        );

        this.model.rotateMesh(
            this.scene,
            'right_engine',
            new Vector3(0, -1, -1),
            3,
            this.scene.getEngine().getFps()
        );
    }


    public moveGuns() {
        this.model.rotateMesh(
            this.scene,
            'left_gun',
            new Vector3(0, 1, 1),
            3,
            this.scene.getEngine().getFps()
        );
    }
}
