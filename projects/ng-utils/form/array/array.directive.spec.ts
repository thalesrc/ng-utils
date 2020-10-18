import { FormArrayDirective } from './array.directive';

describe('FormArrayDirective', () => {
  it('should create an instance', () => {
    const directive = new FormArrayDirective(null, null, null);
    expect(directive).toBeTruthy();
  });
});
