import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Scene } from '@babylonjs/core';
import { RenderEngineService } from '../../services/render-engine.service';

@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.scss']
})
export class SolarSystemComponent implements OnInit, AfterViewInit {

  private scene: Scene;

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private readonly engine: RenderEngineService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.engine.start(this.canvasRef, this.scene);
  }
}
