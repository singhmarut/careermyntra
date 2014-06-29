'use strict';

describe('Controller: QuestionpaperCtrl', function () {

  // load the controller's module
  beforeEach(module('pupilsboardApp'));

  var QuestionpaperCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionpaperCtrl = $controller('QuestionpaperCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
