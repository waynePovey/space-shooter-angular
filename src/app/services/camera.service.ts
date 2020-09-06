import { Injectable } from '@angular/core';
import { UniversalCamera } from '@babylonjs/core/Cameras';
import { Scene, TransformNode, Vector3 } from '@babylonjs/core';
import Utils from '@common/utils';
import { Player } from '../components/player/player';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  public createChaseCam(scene: Scene, player: Player, distance: number, fov: number): UniversalCamera {
    const camRoot = new TransformNode('camRoot', scene);
    camRoot.position = new Vector3(0, 0, 0);
    camRoot.rotation = new Vector3(0, 0, 0);

    const yTilt = new TransformNode('yTilt');
    yTilt.rotation = player.PITCH_TILT;
    yTilt.parent = camRoot;

    const camera = new UniversalCamera('chaseCam', new Vector3(0, 0, distance), scene);
    camera.lockedTarget = camRoot.position;
    camera.fov = Utils.degreesToRads(fov);
    camera.parent = yTilt;
    camera.minZ = 0.05;
    camera.maxZ = 1000;

    scene.activeCamera = camera;
    return camera;
  }

  public updateChaseCam(scene: Scene, player: Player, velLag: number, rotLag: number) {
    const camRoot = scene.getTransformNodeByID('camRoot');
    camRoot.position = Vector3.Lerp(
      camRoot.position,
      new Vector3(player.position.x, player.position.y, player.position.z),
      velLag
    );

    camRoot.rotation = Vector3.Lerp(
      camRoot.rotation,
      new Vector3(player.rotation.x, player.rotation.y, player.rotation.z),
      rotLag
    );
  }
}
