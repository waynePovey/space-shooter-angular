import { Injectable } from '@angular/core';
import { Scene, ActionManager, ExecuteCodeAction, VirtualJoystick } from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private inputMap = {};
  public lJoystick: VirtualJoystick;
  public rJoystick: VirtualJoystick;

  constructor() {}

  public initInput(scene: Scene) {
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown';
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown';
      })
    );

    // this.lJoystick = new VirtualJoystick(true);
    // this.rJoystick = new VirtualJoystick(false);
    // VirtualJoystick.Canvas.style.zIndex = '-1';
  }

  public keyPressed(key: string): boolean {
    return this.inputMap[key];
  }

  public lJoystickPressed() {
    return this.lJoystick.pressed;
  }

  public rJoystickPressed() {
    return this.lJoystick.pressed;
  }
}
