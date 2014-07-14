angular.module( 'topLevelApp', [] )

.controller( 'NameCtrl', function( $scope ) {
	this.name = '';

	this.displayName = function() {
		alert( this.name );
	};
})
