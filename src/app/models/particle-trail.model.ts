import { Vector3, Color4, AbstractMesh, Mesh } from '@babylonjs/core';

export class ParticleTrailModel {
    public name: string;
    public minEmitBox: Vector3;
    public maxEmitBox: Vector3;
    public pTextureUrl: string;
    public direction1: Vector3;
    public direction2: Vector3;
    public color1: Color4;
    public color2: Color4;
    public colorDead: Color4;
    public emitRate: number;
    public minLifeTime: number;
    public maxLifeTime: number;
    public minSize: number;
    public maxSize: number;
    public minEmitPower: number;
    public maxEmitPower: number;
    public updateSpeed: number;
    public emitter: AbstractMesh | Mesh;
    public gpuCap: number;
    public cpuCap: number;

    constructor(init?: Partial<ParticleTrailModel>) {
        Object.assign(this, init);
    }
}