
'use strict';

var startDateTimeValue, endDateTimeValue;

var todoAppController = angular.module('todoAppController', []);

todoAppController.controller('MainController', ['$scope', '$location', 'localStorageService',
    function($scope, $location, localStorageService) {
        $scope.addTaskButton = function() {
        	$location.path('/add');
        }

        $scope.showEditPage = function(taskID) {
        	//console.log(taskID);
        	$location.path('/edit/' + taskID);
        }
        var allKeys = localStorageService.keys();

        if(allKeys.length == 0) {
        	console.log("No tasks added to the list");
        	return;
        }
        	
        var ind = allKeys.indexOf('index');

        if(ind == -1) {
        	console.log("index key not present, some error");
        	return;
        }

        //console.log("Total keys in local: " + allKeys.length);

        var dataArray = new Array();

        for(var key in allKeys) {
        	
        	if(key == 'index' || localStorageService.get(key) == null) continue;

        	var currTask = JSON.parse(localStorageService.get(key));
        	//console.log(currTask.startDate);
        	//console.log(currTask.start);
        	//console.log('local data: ' + JSON.parse(localStorageService.get(key)));
        	var today = new Date();

        	if(today >= currTask.startDate && today <= currTask.endDate) {
        		currTask.status = "ongoing";
        		currTask.showEdit = true;
        		currTask.showDisabled = false;
        	}
        	else if(today > currTask.endDate) {
        		currTask.status = "completed";
        		currTask.showEdit = false;
        		currTask.showDisabled = true;
        	}
        	else if(today < currTask.startDate) {
        		currTask.status = "in future";
        		currTask.showEdit = true;
        		currTask.showDisabled = false;
        	}

        	dataArray.push(currTask);
        }

        $scope.taskData = dataArray;
    }    
]);

todoAppController.controller('FormController', ['$scope', '$location', 'localStorageService',
	function ($scope, $location, localStorageService) {

		$scope.validateDates = function() {
			var startDT = Date.parse(startDateTimeValue);
			var endDT = Date.parse(endDateTimeValue);

			$scope.showMessage = false;
			var today = new Date();

			if(startDT < today || endDT <= startDT) {
				$scope.showMessage = true;
				return true;
			}
			else {
				$location.path('/insert/'+ startDT + '/' + endDT + '/' + $scope.title);
				return false;
			}
		}

		$scope.submit = function() {
			$scope.validateDates();
		}

		$scope.dateTimeNow = function() {
    		$scope.dateStart = new Date();
    		$scope.dateEnd = new Date();
  		};

  		$scope.dateTimeNow();

  		$scope.toggleMinDate = function() {
    		$scope.minDate = $scope.minDate ? null : new Date();
  		};
   
  		$scope.maxDate = new Date('2024-06-22');
  		$scope.toggleMinDate();

  		$scope.dateOptions = {
    		startingDay: 1,
    		showWeeks: false
  		};

  		// Disable weekend selection
  		$scope.disabled = function(calendarDate, mode) {
    		return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
  		};
  
  		$scope.hourStep = 1;
  		$scope.minuteStep = 15;

  		$scope.timeOptions = {
   			hourStep: [1, 2, 3],
    		minuteStep: [1, 5, 10, 15, 25, 30]
  		};

  		$scope.showMeridian = true;
  		$scope.timeToggleMode = function() {
    		$scope.showMeridian = !$scope.showMeridian;
  		};
  
  		$scope.$watch("dateStart", function(value) {
    		console.log('Start date value:' + value);

    		startDateTimeValue = value.toString();
  		}, true);
  		
  		$scope.$watch("dateEnd", function(value) {
    		console.log('End date value:' + value);

    		endDateTimeValue = value.toString();
  		}, true);

  		$scope.resetHours = function() {
    		$scope.dateStart.setHours(1);
    		$scope.dateEnd.setHours(1);
  		};
	}
]);

todoAppController.controller('AddController', ['$scope', '$location', 'localStorageService',
	function AddController($scope, $location, localStorageService) {
		//console.log('add controller loaded');
	}
]);

todoAppController.controller('InsertController', ['$scope', '$routeParams', 'localStorageService', '$location',
	function($scope, $routeParams, localStorageService, $location) {
		
		var allKeys = localStorageService.keys();

		var ind = allKeys.indexOf('index');
		var id;

		if(ind == -1) {
			// index not present in localstorage yet
			// add index to localstorage with 0 as initial value
			//console.log("index first time set");
			localStorageService.set('index', 0);
		}
		
		id = localStorageService.get('index');
			

		var currObject = {
			id: id,
			startDate: $routeParams.startDT,
			endDate: $routeParams.endDT,
			taskTitle: $routeParams.titleTask
		};

		//console.log(currObject);

		localStorageService.set(id, JSON.stringify(currObject));

		var newId = parseInt(id);
		newId += 1;

		localStorageService.set('index', newId);

		$location.path('/');

		//console.log('index: ' + localStorageService.get('index'));
	}
]);

todoAppController.controller('EditController', ['$scope', '$routeParams', 'localStorageService', '$location',
	function($scope, $routeParams, localStorageService, $location) {
		
		var currTask = JSON.parse(localStorageService.get($routeParams.taskID));

		console.log(new Date(parseInt(currTask.startDate)));

		$scope.title = currTask.taskTitle;
		$scope.dateStart = new Date(parseInt(currTask.startDate));
		$scope.dateEnd = new Date(parseInt(currTask.endDate));

		startDateTimeValue = $scope.dateStart;
		endDateTimeValue = $scope.dateEnd;

		$scope.validateDates = function() {
			var startDT = Date.parse(startDateTimeValue);
			var endDT = Date.parse(endDateTimeValue);

			$scope.showMessage = false;

			var today = new Date();

			if(today > startDT || endDT <= startDT) {
				$scope.showMessage = true;
				return true;
			}
			else {
				
				currTask.taskTitle = $scope.title;
				currTask.startDate = startDT;
				currTask.endDate = endDT;
				currTask.id = $routeParams.taskID;

				localStorageService.set($routeParams.taskID, JSON.stringify(currTask));

				//console.log(currTask);
				$location.path('/');

				return false;
			}
		}

		$scope.submit = function() {
			$scope.validateDates();
		}

  		$scope.toggleMinDate = function() {
    		$scope.minDate = $scope.minDate ? null : new Date();
  		};
   
  		$scope.maxDate = new Date('2024-06-22');
  		$scope.toggleMinDate();

  		$scope.dateOptions = {
    		startingDay: 1,
    		showWeeks: false
  		};

  		// Disable weekend selection
  		$scope.disabled = function(calendarDate, mode) {
    		return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
  		};
  
  		$scope.hourStep = 1;
  		$scope.minuteStep = 15;

  		$scope.timeOptions = {
   			hourStep: [1, 2, 3],
    		minuteStep: [1, 5, 10, 15, 25, 30]
  		};

  		$scope.showMeridian = true;
  		$scope.timeToggleMode = function() {
    		$scope.showMeridian = !$scope.showMeridian;
  		};
  
  		$scope.$watch("dateStart", function(value) {
    		console.log('Start date value:' + value);

    		startDateTimeValue = value.toString();
  		}, true);
  		
  		$scope.$watch("dateEnd", function(value) {
    		console.log('End date value:' + value);

    		endDateTimeValue = value.toString();
  		}, true);

  		$scope.resetHours = function() {
    		$scope.dateStart.setHours(1);
    		$scope.dateEnd.setHours(1);
  		};
	}
]);