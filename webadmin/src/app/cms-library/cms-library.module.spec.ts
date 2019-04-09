import { CMSLibraryModule } from './cms-library.module';

describe('CMSLibraryModule', () => {
  let cMSLibraryModule: CMSLibraryModule;

  beforeEach(() => {
    cMSLibraryModule = new CMSLibraryModule();
  });

  it('should create an instance', () => {
    expect(cMSLibraryModule).toBeTruthy();
  });
});
