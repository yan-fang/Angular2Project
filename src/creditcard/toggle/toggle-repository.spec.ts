import { TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, ConnectionBackend,
  Http, RequestOptions,
  Response, ResponseOptions
 } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ToggleRepositoryService } from './toggle-repository.service';

describe('ToggleRepositoryService', () => {
  let backend: MockBackend;
  let lastConnection: MockConnection;
  let toggleRepositoryService: ToggleRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        Http,
        ToggleRepositoryService,
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions }
      ]
    });

    toggleRepositoryService = TestBed.get(ToggleRepositoryService);
    backend = TestBed.get(ConnectionBackend) as MockBackend;
    backend.connections.subscribe((connection: MockConnection) => {
      lastConnection = connection;
    });
  });

  it('getToggles() should hit the correct url', () => {
    toggleRepositoryService.getToggles('check1');

    expect(lastConnection).toBeDefined();
    expect(lastConnection.request.url).toMatch(/api\/ease\/card_details_toggles$/, 'url invalid');
  });

  it('getToggles() should return true if toggle is enabled', () => {
    toggleRepositoryService
      .getToggles('check1')
      .subscribe((response: boolean) => {
        expect(response).toBe(true, 'Expected the "check1" toggle to be true');
      });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({
        check1: true
      })
    })));
  });

  it('getToggles() should return false if toggle is disabled', () => {
    toggleRepositoryService
      .getToggles('check1')
      .subscribe((response: boolean) => {
        expect(response).toBe(false, 'Expected the "check1" toggle to be false');
      });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({
        check1: false
      })
    })));
  });

  it('getToggles() should return false if toggle is missing', () => {
    toggleRepositoryService
      .getToggles('check1')
      .subscribe((response: boolean) => {
        expect(response).toBe(false, 'Expected the "check1" toggle to be missing');
      });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({
        foo: true
      })
    })));
  });
});
