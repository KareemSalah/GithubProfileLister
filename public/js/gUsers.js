var gUsers = angular.module('gUsers', ['ui.router']);

gUsers.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/users/1');
	$stateProvider
	.state('users', {
		url:'/users',
		templateUrl: 'public/partials/main.html'
	})
	.state('users.userInfo', {
		url:'/:userID',
		templateUrl: 'public/partials/userInfo.html',
		controller: function($scope, $stateParams, $http) {
			var found = 0;
			for(i = 0;i < $scope.IDs.length;i++) {
				if($stateParams.userID == IDs[i]) {
					found = 1;
					break;
				}
			}
			//Un comment this if the above loop works
			// if(found == 0) {
			// 	$stateParams.userID=1;
			// }
			$http.get('https://api.github.com/user/' + $stateParams.userID).then(function(response) {
			$scope.currentUser = response.data;
			if($scope.currentUser['bio'] == null) {
				$scope.currentUser['bio'] = "N/A";
			}
			});
		}
	});
})


gUsers.controller('mainCtrl', function($scope, $http) {
	$scope.step = 10;
	$scope.since = 0;
	$scope.allUsers={};
	$scope.temp = [];
	$scope.IDs = [];
	$http.get("https://api.github.com/users?per_page="+$scope.step+"&since="+$scope.since).then(function(response){$scope.temp = response.data; $scope.allUsers = response.data;});
	for(i = 0;i < $scope.temp.length;i++) {
		$scope.allUsers[$scope.temp[i]['id']]=$scope.temp[i];
		if($scope.temp[i]['id'] > $scope.since)
			$scope.since = $scope.temp[i]['id'];
		$scope.IDs.concat($scope.temp[i]['id']);
	}
	$scope.temp = [];
	$scope.moreUsers = function() {
		// $scope.temp = [];
		$http.get("https://api.github.com/users?per_page="+$scope.step+"&since="+$scope.since).then(function(response){ $scope.temp = response.data});
		for(i=0;i < $scope.temp.length;i++) {
			$scope.allUsers[$scope.temp[i]['id']]=$scope.temp[i];
			if($scope.temp[i]['id'] > $scope.since)
				$scope.since = $scope.temp[i]['id'];
			//$scope.since = $scope.temp[i]['id'];
		}
	}
})
