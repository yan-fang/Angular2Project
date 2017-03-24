export function showDialog(module: any, $injector: any, targetState: string): Promise<any> {
  return $injector.get('$ocLazyLoad').load(module).then(() => {
    const $state = $injector.get('$state');
    $state.go(targetState, {}, { location: false });

    const $rootScope = $injector.get('$rootScope');
    $rootScope.close = () => {
      if (document.querySelector('ease-ui-modal')) {
        findScopeForDialog($rootScope).close();
      }
    };
  }).catch((e: any) => {
    console.log('errors', e);
  });
}

function findScopeForDialog($rootScope: any): any {
  let c = $rootScope.$$childHead;
  while (c.closeModal === undefined) {
    c = c.$$nextSibling;
  }
  return c;
}
