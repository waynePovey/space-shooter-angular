import { Injectable, NgZone } from '@angular/core';
import {
  Engine,
  Scene,
} from '@babylonjs/core';

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
      });
    });
  }

  public addInspector(scene: Scene) {
    // INSPECTOR
    window.addEventListener('keydown', (ev) => {
      if (ev.ctrlKey && ev.key === 'i') {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });
  }
}
