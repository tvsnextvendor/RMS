import { ApprovalrequestsModule } from './approvalrequests.module';

describe('ApprovalrequestsModule', () => {
  let approvalrequestsModule: ApprovalrequestsModule;

  beforeEach(() => {
    approvalrequestsModule = new ApprovalrequestsModule();
  });

  it('should create an instance', () => {
    expect(approvalrequestsModule).toBeTruthy();
  });
});
