import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import {
  Scene,
  SceneLoader,
  Vector3,
  HemisphericLight,
  PointLight,
  Color3,
  UniversalCamera,
  GlowLayer
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
import { Plane } from '@components/plane/plane';
import { Router } from '@angular/router';
import { RoutePath } from '@common/routes';

const EARTH_ROTATE_PERIOD = -120;
const FOV = 50;
const CAMERA_DISTANCE = -1.5;
const CAMERA_HEIGHT = 0.3;

// THRUST
const DISTANCE_PER_SEC = 0.02;
const VEL_LAG = 0.07;
const MAX_Z_VEL = 0.05;

// YAW & ROLL
const YAW_PER_SEC = 0.01;
const ROLL_PER_SEC = 2;
const ROT_LAG = 0.05;
const MAX_Y_ROT = 0.008;
const MAX_Z_ROT = Utils.degreesToRads(45);

// PITCH
const PITCH_PER_SEC = 0.01;
const MAX_X_ROT = 0.008;

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
    private particle: ParticleService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  public ngOnInit() {
    setTimeout(() => {
      this.initialised = true;
    }, 500);
  }

  public async ngAfterViewInit() {
    this.scene = await this.renderEngine.createScene(this.canvasRef.nativeElement);
    this.renderEngine.addInspector(this.scene);

    await this.loadScene();

    this.player = new Player(this.scene, MAX_Z_VEL, MAX_Y_ROT, MAX_Z_ROT, MAX_X_ROT, this.input, this.particle, this.modelService);
    this.playerCam = this.camera.createChaseCam(this.scene, this.player, CAMERA_HEIGHT, CAMERA_DISTANCE, FOV);
    this.input.initInput(this.scene);

    this.renderEngine.startEngine(this.scene);
    this.updateScene();

    setTimeout(() => {
      this.initialised = false;
      this.loading = false;
    }, 1000);
  }

  private async loadScene() {
    this.modelService.createSkybox(this.scene, 'assets/textures/skybox/space');
    const sceneContainer = await SceneLoader.LoadAssetContainerAsync('assets/models/solar_system/', 'solar_system.babylon', this.scene);
    sceneContainer.addAllToScene();
    this.createDarkPlanetRing();
    this.createLighting(this.scene);
  }

  private updateScene() {
    this.updateInput();
    this.scene.registerBeforeRender(() => {
      this.camera.updateChaseCam(this.scene, this.player, VEL_LAG, ROT_LAG);
      this.updateModels();
    });
  }

  private updateInput() {
    this.scene.onBeforeRenderObservable.add(() => {
      this.player.thrust(DISTANCE_PER_SEC);
      this.player.turnLeft(YAW_PER_SEC, ROLL_PER_SEC);
      this.player.turnRight(YAW_PER_SEC, ROLL_PER_SEC);
      this.player.pitchDown(PITCH_PER_SEC);
      this.player.pitchUp(PITCH_PER_SEC);
      this.player.toggleTrails();
    });
  }

  private updateModels() {

    if (this.player.playerMesh.intersectsMesh(this.scene.getMeshByID('earth'))) {
        this.ngZone.run(() => {
          this.router.navigateByUrl(RoutePath.HOME);
          this.scene.dispose();
        });
    }
    // BODY ROTATIONS
    this.modelService.rotateMesh(
      this.scene,
      'earth',
      new Vector3(0, 1, 0), EARTH_ROTATE_PERIOD,
      this.renderEngine.engine.getFps()
    );

    this.modelService.rotateMesh(
      this.scene,
      'volcanoWorld',
      new Vector3(0, 1, 0), EARTH_ROTATE_PERIOD,
      this.renderEngine.engine.getFps()
    );

    this.modelService.rotateMesh(
      this.scene,
      'polutionWorld',
      new Vector3(0, 1, 0), EARTH_ROTATE_PERIOD,
      this.renderEngine.engine.getFps()
    );

    this.modelService.rotateMesh(
      this.scene,
      'sun',
      new Vector3(0, 1, 0), -30,
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

    this.modelService.rotateTransformNode(
      this.scene,
      'coDarkRock',
      new Vector3(0, 1, 0), 120,
      this.renderEngine.engine.getFps()
    );
  }

  private createClouds(mesh: string, parent: string) {
    const cloud: any = this.scene.getMeshByID(mesh);
    const radius = 0.6;
    cloud.isVisible = false;

    for (let i = 0; i < 25; i++) {
      const newCloud = cloud.createInstance(mesh + i);
      newCloud.setParent(this.scene.getMeshByID(parent));
      const theta = Utils.degreesToRads(Utils.random(360));
      const phi = Utils.degreesToRads(Utils.random(180));
      newCloud.position = Utils.pointOnSphere(radius, phi, theta);

      const scale = Utils.randomInRange(0.08, 0.1);
      newCloud.scaling = new Vector3(scale, scale, scale);

      newCloud.rotation = new Vector3(0, -theta, -phi);
    }
  }

  private loadPlane() {
    const planes = new Plane(this.scene, 'plane', 'polutionWorld', this.particle, this.modelService);
  }

  private createDarkPlanetRing() {
    const rock: any = this.scene.getMeshByID('darkRock');
    rock.isVisible = false;
    this.modelService.createTransformNode(this.scene, 'darkRock', 'darkWorld');
    const coDarkRock = this.scene.getTransformNodeByID('coDarkRock');
    coDarkRock.rotation = new Vector3(0, 0, 0);
    for (let i = 0; i < 200; i++) {
      const newRock = rock.createInstance('darkRock' + i);
      newRock.setParent(coDarkRock);
      const radius = Utils.randomInRange(6, 10);
      const theta = Utils.degreesToRads(Utils.random(360));
      const phi = Utils.degreesToRads(Utils.randomInRange(83, 97));
      newRock.position = Utils.pointOnSphere(radius, phi, theta);

      const scale = Utils.randomInRange(0.1, 0.3);
      newRock.scaling = new Vector3(scale, scale, scale);

      newRock.rotation = new Vector3(0, -theta, -phi);
    }
  }

  private createLighting(scene: Scene) {
    const ambient = new HemisphericLight('ambientLight', new Vector3(0, 0, 0), scene);
    ambient.intensity = 0.3;

    const sun = new PointLight('sunLight', new Vector3(0, 0, 0), scene);
    sun.intensity = 30000;
    sun.diffuse = new Color3(1, 1, 1);
    sun.parent = this.scene.getMeshByID('sun');
    sun.position = new Vector3(0, 0, 0);
    sun.excludedMeshes.push(this.scene.getMeshByID('sun'));

    const gl = new GlowLayer('glow', this.scene);
    gl.intensity = 1;
  }
}
