'use strict';

describe('Controller: TestmanageCtrl', function () {

  // load the controller's module
  beforeEach(module('pupilsboardApp'));

  var TestmanageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestmanageCtrl = $controller('TestmanageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
