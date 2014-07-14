angular.module( 'dwGuide.speakers', [ 'ngRoute', 'dwGuide.firebase' ] )

.config([ '$routeProvider', function( $routeProvider ) {
	$routeProvider.when( '/speakers', {
		templateUrl: 'src/speakers/speakers.tpl.html'
		, controller: 'SpeakersCtrl'
	})

	.when( '/speakers/:speakerID', {
		templateUrl: 'src/speakers/addEditSpeaker.tpl.html'
		, controller: 'SpeakerDetailCtrl'
	})

	.when( '/speakers/deleteSpeaker/:speakerID', {
		templateUrl: 'src/speakers/deleteConfirm.tpl.html'
		, controller: 'DeleteConfirmCtrl'
	});
}])

.controller( 'SpeakersCtrl', [ '$scope', '$location', 'FirebaseService', function( $scope, $location, FirebaseService ) {
	$scope.speakers = FirebaseService.getSpeakers();
	$scope.getSessionName = function( id ) {
		return FirebaseService.getSessionNameByID( id );
	};

	$scope.addEditSpeaker = function( id ) {
		if( !!id ) {
			$location.path( '/speakers/' + id );
		} else {
			$location.path( '/speakers/ADD' );
		}
	};

	$scope.deleteSpeaker = function( id ) {
		$location.path( '/speakers/deleteSpeaker/' + id );
	};
}])

.controller('SpeakerDetailCtrl', function($scope, $rootScope, $routeParams, FirebaseService, $location){
	var speakerID =  $routeParams.speakerID;

	//grab the speaker from firebase or create a new speaker object
	if (speakerID === 'ADD') {
		$scope.speaker = {}
	} else {
		$scope.speaker = FirebaseService.getSpeaker(speakerID);
	}

	$scope.cancel = function() {
		$location.path('/speakers');
	};


	$scope.addEditSpeakerSubmit = function() {
		if ($scope.speaker.$id) {
			//update mode
			FirebaseService.updateSpeaker($scope.speaker).then(function() {
				//success
				$location.path('/speakers');
			}, function(error) {
				//error
				FirebaseService.handleError(error, '/speakers');
			});
		} else {
			//add mode
			FirebaseService.addSpeaker($scope.speaker).then(function(ref) {
				//success
				$location.path('/speakers');
			}, function(error) {
				//error
				FirebaseService.handleError(error, '/speakers');
			});
		}
	};

})

/**
 * Delete Controller
 */
.controller('DeleteConfirmCtrl', function($scope, $rootScope, $location, $routeParams, FirebaseService){
	var speakerID =  $routeParams.speakerID;
	$scope.speaker = FirebaseService.getSpeaker(speakerID);

	$scope.deleteSpeaker = function() {
		FirebaseService.deleteSpeaker($scope.speaker.$id).then(function(ref) {
			//success
			$location.path('/speakers');
		}, function(error) {
			//error
			FirebaseService.handleError(error, '/speakers');
		});
	};

	$scope.cancelDelete = function() {
		$location.path('/speakers');
	};
});
