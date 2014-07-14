angular.module( 'dwGuide.Auth', ['ngRoute'] )

.config([ '$routeProvider', function( $routeProvider ) {
	$routeProvider.when( '/login', {
		templateUrl: 'src/auth/login.tpl.html'
		, controller: 'LoginCtrl'
		, controllerAs: 'ctrl'
	});
}])

.run(function( $rootScope, $location, $firebaseSimpleLogin, APP_CONSTANTS ) {
	var ref = new Firebase( APP_CONSTANTS.FIREBASE_URL );

	$rootScope.loginFirebaseService = $firebaseSimpleLogin( ref );

	$rootScope.loginFirebaseService.$getCurrentUser().then( function( user ) {
		$rootScope.currentUser = user;
	});
})

.factory( 'AuthFirebaseService', function( $rootScope, $location ) {

	var isAuthed = function() {
		return ( $rootScope.currentUser ) ? true : false;
	};

	var loginMessage = '';
	var redirectPath = '/home'

	var sendToLogin = function( redirectPath, loginMessage ) {
		this.redirectPath = redirectPath;
		this.loginMessage = ( loginMessage ) ? loginMessage : 'Authed Users Only';
		$location.path( '/login' );
	};

	var logout = function() {
		$rootScope.loginFirebaseService.$logout();
		$rootScope.currentUser = null;
		$location.path( '/home' );
	}

	return {
		isAuthenticated: isAuthed,
		loginMessage: loginMessage,
		sendToLogin: sendToLogin,
		logout: logout
	};
})

.controller( 'LoginCtrl', function( $scope, $rootScope, AuthFirebaseService, $location ) {
	$scope.errorMsg = AuthFirebaseService.loginMessage;
	$scope.username = '';
	$scope.password = '';

	$scope.authenticate = function() {
		$scope.errorMsg = '';

		if( $scope.username && $scope.password ) {
			if( $scope.registerUser ) {
				$scope.registerEmail( $scope.username, $scope.password, false );
			} else {
				$rootScope.loginFirebaseService.$login( 'password', {
					email: $scope.username
					, password: $scope.password
				}).then( function( user ) {
					$rootScope.currentUser = user;
					$location.path( AuthFirebaseService.redirectPath );
				}, function( err ) {
					console.log( 'authenticate ' + err );
					$scope.errorMsg = "Invalid Login Credentials"
				})
			}
		}
	};

	$scope.registerEmail = function(email, password, noLogin) {
		$rootScope.loginFirebaseService.$createUser(email, password, noLogin).then(function(user) {
			//SUCCESS - Created and logged in user, the login event is not hit for some reason
			$rootScope.currentUser = user;
			$location.path(AuthFirebaseService.redirectPath);
		}, function(error) {
			//ERROR
			$scope.errorMsg = "Error creating user"
		});
	};

	$scope.authenticateGoogle = function() {
		$rootScope.loginFirebaseService.$login('google', {
			preferRedirect: true,
			rememberMe: true
		}).then(function(user){
			// handled by login event
		}, function(error) {
			console.log('Login failed: ', error);
			$scope.errorMsg = "Invalid Login Credentials"
		});
	};

	$scope.authenticateTwitter = function() {
		$rootScope.loginFirebaseService.$login('twitter').then(function(user) {
			console.log('Logged in as: ', user.uid);
			// handled by login event
		}, function(error) {
			console.log('Login failed: ', error);
			$scope.errorMsg = "Invalid Login Credentials"
		});
	};
})
