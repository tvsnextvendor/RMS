import { RolepermissionModule } from './rolepermission.module';

describe('RolepermissionModule', () => {
  let rolepermissionModule: RolepermissionModule;

  beforeEach(() => {
    rolepermissionModule = new RolepermissionModule();
  });

  it('should create an instance', () => {
    expect(rolepermissionModule).toBeTruthy();
  });
});
