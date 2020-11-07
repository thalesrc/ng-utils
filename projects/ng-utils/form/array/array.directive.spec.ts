import { ArrayDirective } from './array.directive';

describe('FormArrayDirective', () => {
  it('should create an instance', () => {
    const directive = new ArrayDirective(null, null, null);
    expect(directive).toBeTruthy();
  });
});
