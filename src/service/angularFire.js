angular.module( 'dwGuide.firebase', [ 'firebase' ] )

.factory( 'FirebaseService', [ '$firebase', 'APP_CONSTANTS', 'Firebase', 'AuthFirebaseService', function( $firebase, APP_CONSTANTS, Firebase, AuthFirebaseService ) {
	var ref = new Firebase( APP_CONSTANTS.FIREBASE_URL );
	var angularFire = $firebase( ref );

	var speakers = angularFire.$child( 'speakers' );
	var sessions = angularFire.$child( 'sessions' );

	var getSpeakers = function() {
		return speakers;
	};

	var getSpeaker = function( id ) {
		return speakers.$child( id );
	};

	var addSpeaker = function( speaker ) {
		return speakers.$add( speaker );
	};

	var deleteSpeaker = function( id ) {
		return speaker.$remove( id );
	};

	var updateSpeaker = function( speaker ) {
		return speaker.$save();
	}

	var getSessions = function() {
		return sessions;
	}

	var getSession = function( id ) {
		return sessions.$child( id );
	}

	var getSessionNameByID = function( id ) {
		return sessions.$child( id ).name;
	};

	var handleError = function( err, redirectPath, errMsg ) {
		if( err.code === 'PERMISSION_DENIED' ) {
			if( !$$rootScope.currentUser ) {
				AuthFirebaseService.sendToLogin( redirectPath, 'Login Required' );
			} else {
				alert( 'invalid' );
				$location.path( redirectPath );
			}
		}
	}

	return {
		getSpeakers: getSpeakers,
		getSpeaker: getSpeaker,
		addSpeaker: addSpeaker,
		deleteSpeaker: deleteSpeaker,
		updateSpeaker: updateSpeaker,
		getSessions: getSessions,
		getSessionNameByID: getSessionNameByID,
		getSession: getSession,

		handleError: handleError
	};
}]);
