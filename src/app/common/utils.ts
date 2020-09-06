import { Vector3 } from '@babylonjs/core';

export default class Utils {
    constructor() {}

    public static degreesToRads(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    public static random(value: number): number {
        return Math.random() * value;
    }

    public static randomInRange(lower: number, upper: number): number {
        return Math.random() * (upper - lower) + lower;
    }

    public static pointOnSphere(radius: number, phi: number, theta: number): Vector3 {
        return new Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );
    }

    public static capitaliseString(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    public static orbitalPeriodSecs(seconds: number, fps: number): number {
        return (2 * Math.PI) / (seconds * fps);
    }
}
