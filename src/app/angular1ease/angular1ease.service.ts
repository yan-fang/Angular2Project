export class Angular1Ease {
  angular1injector: any;

  get loaded(): boolean {
    return this.angular1injector !== undefined;
  }
}
