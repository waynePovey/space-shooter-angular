import { Injectable, ElementRef, NgZone } from '@angular/core';
import { Engine, Scene, MeshBuilder, HemisphericLight, Vector3 } from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class RenderEngineService {

  public engine: Engine;

  constructor(private ngZone: NgZone) { }

  public start(canvas: ElementRef<HTMLCanvasElement>, scene: Scene): void {
    this.engine = new Engine(canvas.nativeElement, true);

    scene = new Scene(this.engine);
    const mesh = MeshBuilder.CreateBox('testCube', {}, scene);
    const light = new HemisphericLight('ambientLight', new Vector3(0, 0, 0), scene);

    this.ngZone.runOutsideAngular(() => {
      this.engine.runRenderLoop(() => scene.render());
    });
  }
}
