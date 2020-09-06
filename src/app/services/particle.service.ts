import { Injectable } from '@angular/core';
import { GPUParticleSystem, ParticleSystem, Scene, Texture } from '@babylonjs/core';
import { ParticleTrailModel } from '@models/particle-trail.model';

@Injectable({
  providedIn: 'root'
})
export class ParticleService {

  constructor() { }

  public createParticleTrail(
    scene: Scene,
    pModel: ParticleTrailModel
  ): ParticleSystem | GPUParticleSystem {
    const ps = GPUParticleSystem.IsSupported
      ? new GPUParticleSystem(pModel.name, {capacity: pModel.gpuCap}, scene)
      : new ParticleSystem(pModel.name, pModel.cpuCap, scene);

    ps.minEmitBox = pModel.minEmitBox;
    ps.maxEmitBox = pModel.maxEmitBox;
    ps.particleTexture = new Texture(pModel.pTextureUrl, scene);
    ps.direction1 = pModel.direction1;
    ps.direction2 = pModel.direction2;
    ps.color1 = pModel.color1;
    ps.color2 = pModel.color2;
    ps.colorDead = pModel.colorDead;
    ps.emitRate = pModel.emitRate;
    ps.minLifeTime = pModel.minLifeTime;
    ps.maxLifeTime = pModel.maxLifeTime;
    ps.minEmitPower = pModel.minEmitPower;
    ps.maxEmitPower = pModel.maxEmitPower;
    ps.minSize = pModel.minSize;
    ps.maxSize = pModel.maxSize;
    ps.updateSpeed = pModel.updateSpeed;
    ps.emitter = pModel.emitter;

    return ps;
  }
}
