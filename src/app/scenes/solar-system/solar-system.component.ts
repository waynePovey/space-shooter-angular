import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  Scene,
  SceneLoader,
  Vector3,
  Color4,
  HemisphericLight,
  PointLight,
  Color3,
  UniversalCamera,
} from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { RenderEngineService } from '@services/render-engine.service';
import { ModelService } from '@services/model.service';
import Utils from '@common/utils';
import { Player } from '@components/player/player';
import { CameraService } from '@services/camera.service';
import { InputService } from '@services/input.service';
import { ParticleService } from '@services/particle.service';
import { ParticleTrailModel } from '@models/particle-trail.model';

const EARTH_ROTATE_PERIOD = -120;
const FOV = 50;
const CAMERA_DISTANCE = -1.3;

const THRUST_RATE = 0.0001;
const VEL_LAG = 0.07;
const MAX_Z_VEL = 0.03;

const TURN_RATE = 0.0001;
const ROT_LAG = 0.05;
const MAX_Y_ROT = 0.015;
const MAX_Z_ROT = 0.001;


@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.scss']
})
export class SolarSystemComponent implements OnInit, AfterViewInit {

  private scene: Scene;
  public initialised = false;
  public loading = true;
  private player: Player;
  private playerCam: UniversalCamera;

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(
    private readonly renderEngine: RenderEngineService,
    private modelService: ModelService,
    private camera: CameraService,
    private input: InputService,
    private particle: ParticleService
  ) {}

  public ngOnInit() {
    setTimeout(() => {
      this.initialised = true;
    }, 500);
  }

  public async ngAfterViewInit() {
    this.scene = await this.renderEngine.createScene(this.canvasRef.nativeElement);
    this.renderEngine.addInspector(this.scene);

    await this.loadSceneObjects();
    this.player = new Player(this.scene, MAX_Z_VEL, MAX_Y_ROT, MAX_Z_ROT, this.input, this.particle, this.modelService);
    this.playerCam = this.camera.createChaseCam(this.scene, this.player, CAMERA_DISTANCE, FOV);
    this.input.initInput(this.scene);

    this.renderEngine.startEngine(this.scene);
    this.updateScene();

    setTimeout(() => {
      this.initialised = false;
      this.loading = false;
    }, 1000);
  }

  private async loadSceneObjects() {
    this.modelService.createSkybox(this.scene, 'assets/textures/skybox/skybox');
    const sceneContainer = await SceneLoader.LoadAssetContainerAsync('assets/models/solar_system/', 'solar_system.babylon', this.scene);
    sceneContainer.addAllToScene();
    this.createCloudInstances();
    this.loadPlane();
    this.createLighting(this.scene);
  }

  private updateScene() {
    this.updateInput();
    this.scene.registerBeforeRender(() => {
      this.updateModels();
      this.camera.updateChaseCam(this.scene, this.player, VEL_LAG, ROT_LAG);
    });
  }

  private updateInput() {
    this.scene.onBeforeRenderObservable.add(() => {
      this.player.thrust(THRUST_RATE);
      this.player.turnLeft(TURN_RATE);
      this.player.turnRight(TURN_RATE);
      this.player.toggleTrails();
    });
  }

  private updateModels() {
    // BODY ROTATIONS
    this.modelService.rotateMesh(
      this.scene,
      'earth',
      new Vector3(0, 1, 0), EARTH_ROTATE_PERIOD,
      this.renderEngine.engine.getFps()
    );

    this.modelService.rotateMesh(
      this.scene,
      'volcano_world',
      new Vector3(0, 1, 0), EARTH_ROTATE_PERIOD,
      this.renderEngine.engine.getFps()
    );

    // EARTH SATS
    this.modelService.rotateTransformNode(
      this.scene,
      'coPlane',
      new Vector3(0, 1, 0), 30,
      this.renderEngine.engine.getFps()
    );

    this.modelService.rotateTransformNode(
      this.scene,
      'coMoon',
      new Vector3(0, 1, 0), 30,
      this.renderEngine.engine.getFps()
    );

    this.player.animateEngines();
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

    const lEngine = this.particle.createParticleTrail(this.scene, new ParticleTrailModel({
      name: 'lEng',
      minEmitBox: new Vector3(0.02, -0.01, 0.002),
      maxEmitBox: new Vector3(0.03, -0.015, 0.003),
      pTextureUrl: 'assets/textures/plane_trail/plane_trail.jpg',
      direction1: new Vector3(0, Utils.degreesToRads(0), 0),
      direction2: new Vector3(0, Utils.degreesToRads(0), 0),
      color1: new Color4(1, 1, 1, 1.0),
      color2: new Color4(0.5, 0.5, 0.5, 1.0),
      colorDead: new Color4(0, 0, 0, 0.0),
      emitRate: 600,
      minLifeTime: 0.2,
      maxLifeTime: 0.4,
      minSize: 0.01,
      maxSize: 0.02,
      minEmitPower: 1,
      maxEmitPower: 3,
      updateSpeed: 0.001,
      emitter: plane,
      gpuCap: 2000,
      cpuCap: 2000
    }));
    lEngine.start();

    const rEngine = this.particle.createParticleTrail(this.scene, new ParticleTrailModel({
      name: 'rEng',
      minEmitBox: new Vector3(0.02, 0.01, 0.002),
      maxEmitBox: new Vector3(0.03, 0.015, 0.003),
      pTextureUrl: 'assets/textures/plane_trail/plane_trail.jpg',
      direction1: new Vector3(0, Utils.degreesToRads(0), 0),
      direction2: new Vector3(0, Utils.degreesToRads(0), 0),
      color1: new Color4(1, 1, 1, 1.0),
      color2: new Color4(0.5, 0.5, 0.5, 1.0),
      colorDead: new Color4(0, 0, 0, 0.0),
      emitRate: 600,
      minLifeTime: 0.2,
      maxLifeTime: 0.4,
      minSize: 0.01,
      maxSize: 0.02,
      minEmitPower: 1,
      maxEmitPower: 3,
      updateSpeed: 0.001,
      emitter: plane,
      gpuCap: 2000,
      cpuCap: 2000
    }));
    rEngine.start();
  }

  private createLighting(scene: Scene) {
    const ambient = new HemisphericLight('ambientLight', new Vector3(0, 0, 0), scene);
    ambient.intensity = 0.6;

    const sun = new PointLight('sunLight', new Vector3(0, 0, 0), scene);
    sun.intensity = 50000;
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 0, 0);
    sun.parent = this.scene.getMeshByID('sun');
    sun.position = new Vector3(125, 0, 8);
  }
}
