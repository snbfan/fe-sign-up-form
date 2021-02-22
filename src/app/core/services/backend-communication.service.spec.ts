import { Observable, of } from 'rxjs';
import { BackendCommunicationService } from './backend-communication.service';

describe ('Service BackendCommunicationService:', () => {
  let httpClientSpy: { post: jasmine.Spy };
  let backendCommunicationService: BackendCommunicationService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    backendCommunicationService = new BackendCommunicationService(httpClientSpy as any);
    httpClientSpy.post.and.returnValue(of(true));
  });

  describe('Method signUp: ', () => {
    it('should call httpClient post with correct params', () => {
      const payload = { a: 1, b: 2 };

      backendCommunicationService.signUp(payload);

      expect(httpClientSpy.post.calls.count()).toBe(1);
      expect(httpClientSpy.post.calls.allArgs()[0][1]).toEqual(payload);
    });

    it('should return Observable', () => {
      const postResult$ = backendCommunicationService.signUp({});
      expect(postResult$ instanceof Observable).toEqual(true);
    });
  });
});
