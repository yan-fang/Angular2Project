import { Route } from '@angular/router';
import {
  BaseRequestOptions, ConnectionBackend,
  Http, RequestOptions,
  Response, ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ToggleGuard, ToggleRepositoryService } from './index';

describe('ToggleGuard', () => {
  let backend: MockBackend;
  let lastConnection: MockConnection;
  let toggleGuard: ToggleGuard;
  let toggleRepositoryService: ToggleRepositoryService;
  let testRoute: Route = {
      path: 'potato',
      loadChildren: 'path/to/fake/test/module/test.module#TestModule',
      canLoad: [ ToggleGuard ],
      data: {
        toggle: 'potatoToggle'
      }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        Http,
        ToggleGuard,
        ToggleRepositoryService,
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions },
      ]
    });

    toggleGuard = TestBed.get(ToggleGuard);
    toggleRepositoryService = TestBed.get(ToggleRepositoryService);
    backend = TestBed.get(ConnectionBackend) as MockBackend;
    backend.connections.subscribe((connection: MockConnection) => {
      lastConnection = connection;
    });
  });

  it('canLoad() should call toggleRepositoryService.getToggles()', () => {
    spyOn(toggleRepositoryService, 'getToggles')
      .and.callFake(() => Observable.of(true));

    toggleGuard.canLoad(testRoute)
      .subscribe(() => {
        expect(toggleRepositoryService.getToggles).toHaveBeenCalledWith('potatoToggle');
      });
  });

  it('canLoad() should return false if toggle not found', () => {
    toggleGuard.canLoad(testRoute)
      .subscribe((hasToggle: boolean) => {
        expect(hasToggle).toEqual(false);
      });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({
        foo: true
      })
    })));
  });

  it('canLoad() should return false if toggle is false', () => {
    toggleGuard.canLoad(testRoute)
      .subscribe((hasToggle: boolean) => {
        expect(hasToggle).toEqual(false);
      });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({
        potatoToggle: false
      })
    })));
  });

  it('canLoad() should return true if toggle is true', () => {
    toggleGuard.canLoad(testRoute)
      .subscribe((hasToggle: boolean) => {
        expect(hasToggle).toEqual(true);
      });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({ potatoToggle: true })
    })));
  });
});
