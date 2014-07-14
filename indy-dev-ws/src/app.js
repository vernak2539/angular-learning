var deps = [
	'ngRoute'
	, 'dwGuide.speakers'
	, 'dwGuide.firebase'
	, 'dwGuide.Auth'
];

var app = angular.module( 'dwGuide', deps );

app.constant( 'APP_CONSTANTS', {
	FIREBASE_URL: 'https://dwguide-av.firebaseio.com'
});

app.config([ '$routeProvider', function( $routeProvider ) {
	$routeProvider.when( '/home', {
		templateUrl: 'src/home.tpl.html'
	});

	$routeProvider.otherwise({
		redirectTo: '/home'
	});
}]);

app.controller( 'AppCtrl', [ '$scope', '$location', 'AuthFirebaseService', function( $scope, $location, AuthFirebaseService ) {
	$scope.showSpeakers = function() {
		$location.path( '/speakers' );
	};

	$scope.logout = function() {
		AuthFirebaseService.logout();
	};

	$scope.login = function() {
		AuthFirebaseService.sendToLogin( $location.path() );
	};
}]);
