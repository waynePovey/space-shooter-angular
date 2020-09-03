import { Injectable, NgZone } from '@angular/core';
import {
  Engine,
  Scene,
  Vector3,
} from '@babylonjs/core';
import Utils from 'src/app/common/utils';

const eRotPer = -120;

@Injectable({
  providedIn: 'root'
})
export class RenderEngineService {

  public engine: Engine;

  constructor(private ngZone: NgZone) { }

  public createScene(canvas: HTMLCanvasElement): Promise<Scene> {
    return new Promise<Scene>(resolve => {
      this.engine = new Engine(canvas, true);
      const scene = new Scene(this.engine);
      resolve(scene);
    });
  }

  public startEngine(scene: Scene): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', () => this.engine.resize());

      this.engine.runRenderLoop(() => {
        scene.render();

        // BODY ROTATIONS
        scene.getMeshByID('earth')
        ?.rotate(new Vector3(0, 1, 0), Utils.orbitalPeriodSecs(eRotPer, this.engine.getFps()));
        scene.getMeshByID('volcano_world')
          ?.rotate(new Vector3(0, 1, 0), Utils.orbitalPeriodSecs(eRotPer, this.engine.getFps()));

        // EARTH SATS
        scene.getTransformNodeByID('coPlane')
          ?.rotate(new Vector3(0, 1, 0), Utils.orbitalPeriodSecs(30, this.engine.getFps()));
        scene.getTransformNodeByID('coMoon')
          ?.rotate(new Vector3(0, 1, 0), Utils.orbitalPeriodSecs(30, this.engine.getFps()));
      });
    });
  }
}
