describe('BookmarkIndexController', function() {
	var scope;
	var ctrl;

	beforeEach(module('locksmithApp'));

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl  = $controller('BookmarkIndexController', {$scope: scope});
	}));

	it('should have start position 0', function() {
		expect(scope.position).toBe(0);
	});

	it('should remain at position 0', function() {
		expect(scope.position).toBe(0);
		scope.keydown({keyCode: 38}); // key up
		expect(scope.position).toBe(0);
	});

	it('should go to position 1', function() {
		expect(scope.position).toBe(0);
		scope.keydown({keyCode: 40}); // key down
		expect(scope.position).toBe(1);
	});

	it('should go to position 2', function() {
		expect(scope.position).toBe(0);
		scope.keydown({keyCode: 40}); // key down
		scope.keydown({keyCode: 40}); // key down
		expect(scope.position).toBe(2);
	});

	it('should return to position 1', function() {
		expect(scope.position).toBe(0);
		scope.keydown({keyCode: 40}); // key down
		scope.keydown({keyCode: 40}); // key down
		scope.keydown({keyCode: 38}); // key up
		expect(scope.position).toBe(1);
	});

	it('should show an OTP popup', function() {
		expect(scope.popup).not.toBeDefined();
		scope.showPopup();
		expect(scope.popup).toBeDefined();
	});
});