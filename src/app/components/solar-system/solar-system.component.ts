import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  Scene,
  Vector3,
  ParticleSystem,
  Texture,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  PointLight,
  Color3 } from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { RenderEngineService } from 'src/app/services/render-engine.service';
import { ModelService } from 'src/app/services/model.service';
import Utils from 'src/app/common/utils';

@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.scss']
})
export class SolarSystemComponent implements OnInit, AfterViewInit {

  private scene: Scene;
  private camera: ArcRotateCamera;
  public initialised = false;
  public loading = true;

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private readonly engine: RenderEngineService, private modelService: ModelService) {}

  public ngOnInit() {
    setTimeout(() => {
      this.initialised = true;
    }, 500);
  }

  public async ngAfterViewInit() {
    this.scene = await this.engine.createScene(this.canvasRef.nativeElement);

    // INSPECTOR
    window.addEventListener('keydown', (ev) => {
      if (ev.ctrlKey && ev.key === 'i') {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide();
        } else {
          this.scene.debugLayer.show();
        }
      }
    });

    this.camera = new ArcRotateCamera('camera', 90, 0, 100, new Vector3(0, 0, 0), this.scene);
    this.camera.maxZ = 2000000;
    this.camera.attachControl(this.canvasRef.nativeElement);

    await this.loadSceneObjects().then(() => {
      this.engine.startEngine(this.scene);

      setTimeout(() => {
        this.initialised = false;
        this.loading = false;
      }, 500);
    });
  }

  private async loadSceneObjects() {
    this.modelService.createSkybox(this.scene, 'assets/textures/skybox/skybox');
    await this.modelService.loadModel(this.scene, 'assets/models/solar_system/', 'solar_system.babylon').then(() => {
      this.camera.setTarget(this.scene.getMeshByID('player'));

      this.createCloudInstances();
      this.loadPlane();
      this.createLighting(this.scene);
    });
  }

  private createCloudInstances() {
    const cloud: any = this.scene.getMeshByID('clouds');
    const radius = 0.6;
    cloud.isVisible = false;

    for (let i = 0; i < 20; i++) {
      const newCloud = cloud.createInstance('cloud' + i);
      newCloud.setParent(this.scene.getMeshByID('earth'));

      const theta = Utils.degreesToRads(Utils.random(360));
      const phi = Utils.degreesToRads(Utils.random(180));
      newCloud.position = Utils.pointOnSphere(radius, phi, theta);

      const scale = Utils.randomInRange(0.4, 0.6);
      newCloud.scaling = new Vector3(scale, scale, scale);

      newCloud.rotation = new Vector3(0, -theta, -phi);
    }
  }

  private loadPlane() {
    const plane: any = this.scene.getMeshByID('plane');
    const coPlane = this.modelService.createTransformNode(this.scene, 'plane', 'earth');
    coPlane.position = new Vector3(0, 0, 0);
    coPlane.rotation = new Vector3(0, 0, 0);
    plane.rotation = new Vector3(0, 0, 0);
    plane.setParent(coPlane);

    const psL = new ParticleSystem('psL', 1000, this.scene);
    const psR = new ParticleSystem('psR', 1000, this.scene);

    psL.minEmitBox = new Vector3(0.02, -0.01, 0.002);
    psL.maxEmitBox = new Vector3(0.03, -0.015, 0.003);
    psR.minEmitBox = new Vector3(0.02, 0.01, 0.002);
    psR.maxEmitBox = new Vector3(0.03, 0.015, 0.003);

    [psL, psR].forEach(ps => {
      ps.particleTexture = new Texture('assets/textures/plane_trail/plane_trail.jpg', this.scene);
      ps.direction1 = new Vector3(0, Utils.degreesToRads(0), 0);
      ps.direction2 = new Vector3(0, Utils.degreesToRads(0), 0);
      ps.color1 = new Color4(1, 1, 1, 1.0);
      ps.color2 = new Color4(0.5, 0.5, 0.5, 1.0);
      ps.colorDead = new Color4(0, 0, 0, 0.0);
      ps.emitRate = 600;
      ps.minLifeTime = 0.3;
      ps.maxLifeTime = 0.4;
      ps.minSize = 0.02;
      ps.maxSize = 0.03;
      ps.updateSpeed = 0.001;
      ps.emitter = plane;

      ps.start();
    });
  }

  private createLighting(scene: Scene) {
    const ambient = new HemisphericLight('ambientLight', new Vector3(0, 0, 0), scene);
    ambient.intensity = 1;

    const sun = new PointLight('sunLight', new Vector3(0, 0, 0), scene);
    sun.intensity = 30000;
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 0, 0);
    sun.parent = this.scene.getMeshByID('sun');
    sun.position = new Vector3(125, 0, 8);
  }
}
