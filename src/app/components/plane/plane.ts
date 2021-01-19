import {
    AbstractMesh,
    Color4,
    Scene,
    Vector3 } from '@babylonjs/core';
import { ParticleTrailModel } from '@models/particle-trail.model';
import { ParticleService } from '@services/particle.service';
import { ModelService } from '@services/model.service';


export class Plane {
    private mesh: any;

    constructor(
        private scene: Scene,
        private meshId: string,
        public parentMeshOrNode: string,
        private particleService: ParticleService,
        private modelService: ModelService
    ) {
        this.mesh = scene.getMeshByID(meshId);
        // this.mesh.isVisible = false;
    }

    public get planeMesh(): AbstractMesh {
        return this.mesh;
    }

    public loadPlane(instances: number) {
        // this.mesh.position = new Vector3(0.7, 0, 0);
        // this.mesh.rotation = new Vector3(Utils.degreesToRads(180), Utils.degreesToRads(90), 0);

        const pTextureUrl = 'assets/textures/plane_trail/plane_trail.jpg';
        const direction1 = new Vector3(0, 0, 0);
        const direction2 = new Vector3(0, 0, 0);
        const color1 = new Color4(0.5, 0.5, 0.5, 1.0);
        const color2 = new Color4(1, 1, 1, 1.0);
        const colorDead = new Color4(0, 0, 0, 0.0);
        const emitRate = 500;
        const minLifeTime = 0.2;
        const maxLifeTime = 0.4;
        const minSize = 0.01;
        const maxSize = 0.02;
        const minEmitPower = 1;
        const maxEmitPower = 3;
        const updateSpeed = 0.001;
        const gpuCap = 500;
        const cpuCap = 200;

        const lEng = this.particleService.createParticleTrail(this.scene, new ParticleTrailModel({
            name: 'lEng',
            minEmitBox: new Vector3(0.02, -0.007, 0.002),
            maxEmitBox: new Vector3(0.03, -0.01, 0.003),
            pTextureUrl: pTextureUrl,
            direction1: direction1,
            direction2: direction2,
            color1: color1,
            color2: color2,
            colorDead: colorDead,
            emitRate: emitRate,
            minLifeTime: minLifeTime,
            maxLifeTime: maxLifeTime,
            minSize: minSize,
            maxSize: maxSize,
            minEmitPower: minEmitPower,
            maxEmitPower: maxEmitPower,
            updateSpeed: updateSpeed,
            emitter: this.mesh,
            gpuCap: gpuCap,
            cpuCap: cpuCap
        }));
        lEng.start();

        const rEng = this.particleService.createParticleTrail(this.scene, new ParticleTrailModel({
            name: 'rEng',
            minEmitBox: new Vector3(0.02, 0.007, 0.002),
            maxEmitBox: new Vector3(0.03, 0.01, 0.003),
            pTextureUrl: pTextureUrl,
            direction1: direction1,
            direction2: direction2,
            color1: color1,
            color2: color2,
            colorDead: colorDead,
            emitRate: emitRate,
            minLifeTime: minLifeTime,
            maxLifeTime: maxLifeTime,
            minSize: minSize,
            maxSize: maxSize,
            minEmitPower: minEmitPower,
            maxEmitPower: maxEmitPower,
            updateSpeed: updateSpeed,
            emitter: this.mesh,
            gpuCap: gpuCap,
            cpuCap: cpuCap
        }));
        rEng.start();

        // for (let i = 0; i < instances; i++) {
        //     const newPlane = this.mesh.createInstance(this.mesh.name + i);
        //     const coNewPlane = this.modelService.createTransformNode(this.scene, newPlane.name, this.parentMeshOrNode);
        //     const theta = Utils.degreesToRads(Utils.random(360));
        //     console.log("theta (around z): ", theta);
        //     const phi = Utils.degreesToRads(Utils.random(180));
        //     console.log("phi (down from z): ", phi);
        //     newPlane.position = Utils.pointOnSphere(7, 0, 0);
        //     newPlane.rotation = new Vector3(0, 0, 0);
        //     const scale = Utils.randomInRange(0.8, 1.2);
        //     newPlane.scaling = new Vector3(scale, scale, scale);

        //     const lEng = this.particleService.createParticleTrail(this.scene, new ParticleTrailModel({
        //         name: 'lEng',
        //         minEmitBox: new Vector3(0.02, -0.007, 0.002),
        //         maxEmitBox: new Vector3(0.03, -0.01, 0.003),
        //         pTextureUrl: pTextureUrl,
        //         direction1: direction1,
        //         direction2: direction2,
        //         color1: color1,
        //         color2: color2,
        //         colorDead: colorDead,
        //         emitRate: emitRate,
        //         minLifeTime: minLifeTime,
        //         maxLifeTime: maxLifeTime,
        //         minSize: minSize,
        //         maxSize: maxSize,
        //         minEmitPower: minEmitPower,
        //         maxEmitPower: maxEmitPower,
        //         updateSpeed: updateSpeed,
        //         emitter: newPlane,
        //         gpuCap: gpuCap,
        //         cpuCap: cpuCap
        //     }));
        //     lEng.start();

        //     const rEng = this.particleService.createParticleTrail(this.scene, new ParticleTrailModel({
        //         name: 'rEng',
        //         minEmitBox: new Vector3(0.02, 0.007, 0.002),
        //         maxEmitBox: new Vector3(0.03, 0.01, 0.003),
        //         pTextureUrl: pTextureUrl,
        //         direction1: direction1,
        //         direction2: direction2,
        //         color1: color1,
        //         color2: color2,
        //         colorDead: colorDead,
        //         emitRate: emitRate,
        //         minLifeTime: minLifeTime,
        //         maxLifeTime: maxLifeTime,
        //         minSize: minSize,
        //         maxSize: maxSize,
        //         minEmitPower: minEmitPower,
        //         maxEmitPower: maxEmitPower,
        //         updateSpeed: updateSpeed,
        //         emitter: newPlane,
        //         gpuCap: gpuCap,
        //         cpuCap: cpuCap
        //     }));
        //     rEng.start();
        // }
    }
}
