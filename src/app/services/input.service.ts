import { Injectable } from '@angular/core';
import { Scene, ActionManager, ExecuteCodeAction, Axis, Space, Vector3, Scalar } from '@babylonjs/core';
import { Player } from '@components/player/player';
import Utils from '@common/utils';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private inputMap = {};

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
  }

  public keyPressed(key: string): boolean {
    return this.inputMap[key];
  }
}
