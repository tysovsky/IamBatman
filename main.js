$(function () {

	var subjectsArray;
	var unitsArray;
	var lessonsArray;
	
	var learningTargetsArray = [];
	var activitiesArray = [];
	var summativeAssessmentsArray = [];
	var formativeAssessmentsArray = [];
	

	var $subjects_box = $('#subject_chooser');
	var currentSubjectIndex = 0;

	var $units_box = $('#unit_chooser');
	var currentUnitIndex = 0;

	var $lessons_box = $('#lesson_chooser');
	var currentLessonIndex = 0;
	
	var lessonPartsMap = new Object();
	lessonPartsMap['LT'] = learningTargetsArray;
	lessonPartsMap['FA'] = formativeAssessmentsArray;
	lessonPartsMap['SA'] = summativeAssessmentsArray;
	lessonPartsMap['TA'] = activitiesArray;



	var $lesson_learning_targets = $('#learning_targets_list');
	var $lesson_formative_assessments = $('#formative_assessments_list');
	var $lesson_summative_assessments = $('#summative_assessments_list');
	var $lesson_task_activities = $('#tasks_list');

	var $btn_add_learning_target = $('#btn_add_learning_target');
	var $input_add_learning_target = $('#input_add_learning_target');
	var $btn_add_activity = $('#btn_add_activity');
	var $input_add_activity = $('#input_add_activity');
	var $btn_add_summative_assessment = $('#btn_add_summative_assessment');
	var $input_add_summative_assessment = $('#input_add_summative_assessment');
	var $btn_add_formative_assessment = $('#btn_add_formative_assessment');
	var $input_add_formative_assessment = $('#input_add_formative_assessment');
	

	$input_add_learning_target.hide();
	$input_add_activity.hide();
	$input_add_summative_assessment.hide();
	$input_add_formative_assessment.hide();
		
	$.material.init();
	
//---------------------------------------------------------------------
	$('#external-events .fc-event').each(function() {

			// store data so the calendar knows to render an event upon drop
			$(this).data('event', {
				title: $.trim($(this).text()), // use the element's text as the event title
				stick: true // maintain when user navigates (see docs on the renderEvent method)
			});

			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});

		});
	 
	$('#calendar').fullCalendar({
//			header: false,
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
			height: 650,
			views:{
				scheduleView: {
					type: 'basicWeek',
					duration: { days: 5 },
					buttonText: 'Schedule'
				}
			},
			defaultDate: '2015-02-12',
			droppable: true,
			defaultView: 'scheduleView',
			editable: true,
			eventLimit: true, // allow "more" link when too many events
		});
		
	$('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
		console.log('Showing')
		$('#calendar').fullCalendar('render');
	});

//----------------------------------------------------------------------
	getSubjects();


	//Subjects dropbox changed
	$subjects_box.on('change', function (e) {
		var selected = $(this).find("option:selected");
        
		currentSubjectIndex = selected.index();

		//Clear units dropbox
		$units_box.find('option').remove().end();


		//Clear lessons dropbox
		$lessons_box.find('option').remove().end();

		clearLessonParts();
			
		//Update units
		getUnits(subjectsArray[currentSubjectIndex].NCES);
	});

	//Units dropbox changed
	$units_box.on('change', function (e) {
    	
		var selected = $(this).find('option:selected');
        
		currentUnitIndex = selected.index();

		//Clear lessons
		$lessons_box.find('option').remove().end();
            
		clearLessonParts();

		//Update lessons
		getLessons(unitsArray[currentUnitIndex]._id);

	});

	$lessons_box.on('change', function (e) {
    	
		var selected = $(this).find('option:selected');
        
		currentLessonIndex = selected.index();
		
		populateLessonParts();

		
	});
		
		
//-----------------------------------------------------------------
	$btn_add_learning_target.on('click', function (arg) {
		$input_add_learning_target.toggle('fast');
	});

   $input_add_learning_target.keypress(function(e){
		//13 is the enter key
	   if(e.which == 13){
			addLessonPart('LT', $input_add_learning_target.val(), function (addedTarget) {
					getLessonParts(unitsArray[currentUnitIndex]._id);	
					$input_add_learning_target.toggle('fast');
			});
	   }
	});
	
	$btn_add_activity.on('click', function (arg) {
		$input_add_activity.toggle('fast');
	});
	
	$input_add_activity.keypress(function(e){
		//13 is the enter key
	   if(e.which == 13){
			addLessonPart('TA', $input_add_activity.val(), function (addedTarget) {
					getLessonParts(unitsArray[currentUnitIndex]._id);	
					$input_add_activity.toggle('fast');
			});
	   }
	});
		
	
	$btn_add_summative_assessment.on('click', function (arg) {
			console.log('clicked');
		$input_add_summative_assessment.toggle('fast');
	});

	$input_add_formative_assessment.keypress(function(e){
		//13 is the enter key
	   if(e.which == 13){
			addLessonPart('FA', $input_add_formative_assessment.val(), function (addedTarget) {
					getLessonParts(unitsArray[currentUnitIndex]._id);	
					$input_add_summative_assessment.toggle('fast');
			});
	   }
	});
	
	$btn_add_formative_assessment.on('click', function (arg) {
		$input_add_formative_assessment.toggle('fast');
	});
	
	$input_add_summative_assessment.keypress(function(e){
		//13 is the enter key
	   if(e.which == 13){
			addLessonPart('SA', $input_add_summative_assessment.val(), function (addedTarget) {
					getLessonParts(unitsArray[currentUnitIndex]._id);	
					$input_add_formative_assessment.toggle('fast');
			});
	   }
	});
	
//--------------------------------------------------------------------
	//Get Subjects user teaches
	function getSubjects() {
		console.log("Getting Subjects");
		$.ajax({
				type: 'GET',
				url: '/api/getSubjects',
				success: function (data) {
					subjectsArray = data;
					currentSubjectIndex = 0;
					$.each(data, function (i, cirriculum) {
                	
						$subjects_box.append('<option>' + cirriculum.String + '</option>');
                    
					});

					getUnits(subjectsArray[currentSubjectIndex].NCES);
				}
		});
	}

	//Get units that belong to the current subject
	getUnits = function(_sced) {
		console.log('Getting Units');
		$.ajax({
				type: 'POST',
				url: '/api/getUnits',
				data: {sced: _sced},
				success: function (data) {
					unitsArray = data;
					currentUnitIndex = 0;

					$.each(data, function (i, unit) {
						$units_box.append('<option>' + unit.String + '</option>');
					});

					getLessons(unitsArray[currentUnitIndex]._id);
				   
				}

		});
	}
     
	//Get lessons that belong to the current unit
	getLessons = function (_unitId) {
				console.log('Getting Lessons');
				$.ajax({
					type: 'POST',
					url: '/api/getLessons',
					data: {unitid: _unitId},
					success: function (data) {
						lessonsArray = data;
						currentLessonIndex = 0;
						$.each(data, function (i, lesson) {
								$lessons_box.append('<option>' + lesson.String + '</option>');
						});
						
						getLessonParts(unitsArray[currentUnitIndex]._id);
					}

				});
		}

	getLessonParts = function (_unitId){
		console.log('Getting Lesson Parts');
		clearLessonPartsArrays();		
		
				$.ajax({
					type: 'POST',
					url: '/api/getLessonParts',
					data: {unitId: _unitId},
					success: function (data) {

						for(var i = 0; i < data.length; i++){

								switch(data[i].partType){


									case 'LT':

											learningTargetsArray.push(data[i]);
										break;

									case 'FA':

											formativeAssessmentsArray.push(data[i]);

										break;

									case 'SA':

											summativeAssessmentsArray.push(data[i]);

										break;

									case 'TA':

											activitiesArray.push(data[i])


										break;
										
									case 'DN':

											$lesson_do_nows.val(lessonPartsArray[i].String);

										break;

									case 'HOTQ':

										break;

									case 'TRU':

										break;

									case 'MN':

										break;

									case 'TN':

										break;

									case 'LINK':

										break;
								}

						}
						
						populateLessonParts();
							
					}

				});
		}
		
	addLessonPart = function (_type, _String, callback) {
		
		$.ajax({
					type: 'POST',
					url: '/api/addLessonPart',
					data: {unitId: unitsArray[currentUnitIndex]._id, lessonId: lessonsArray[currentLessonIndex]._id, partType: _type, String: _String},
					success: function (addedLessonPart) {
						callback(addedLessonPart);
					}

				});
	
	}

	setLessonParts = function (_id, _lessonId, _added, type) {
		console.log('Updating ' + _id);
			$.ajax({
					type: 'POST',
					url: '/api/updateLessonParts',
					data: {id: _id, lessonId: _lessonId, added: _added},
					success: function (data) {
						var index = lessonPartsMap[type].map(function(d) { return d['_id']; }).indexOf(_id);
						console.log(index);
						if(_added == true){lessonPartsMap[type][index].added.push(_lessonId);}
						else{lessonPartsMap[type][index].added.splice(index, 1);}
						
					}
				});
	}
//--------------------------------------------------------------------		
		
	populateLessonParts = function(){
		
		$('.sol-container').remove();
		clearLessonParts();
		
		$('#learning_targets_dropbox').searchableOptionList({
			data: convertToSolFormat(learningTargetsArray),
			showSelectionBelowList: true,
			showSelectionContainer: $lesson_learning_targets,
			maxHeight: '600px',
			showSelectAll: true,
			
			events: {            
            onChange: function(sol,changedElements) {
					if(changedElements.length == 1){
						setLessonParts(changedElements.context.value, lessonsArray[currentLessonIndex]._id, changedElements.context.checked, 'LT'); 
					}
					else{
						for(var i = 0; i < changedElements.length; i++){
							setLessonParts(changedElements[i].context.value, lessonsArray[currentLessonIndex]._id, changedElements[i].context.checked); 
						}					
					} 
					         
            }
        }
        });

		$('#activities_dropbox').searchableOptionList({
			data: convertToSolFormat(activitiesArray),
			showSelectionBelowList: true,
			showSelectionContainer: $lesson_task_activities,
			maxHeight: '600px',
			showSelectAll: true,
			events: {            
            onChange: function(sol,changedElements) {
					if(changedElements.length == 1){
						setLessonParts(changedElements.context.value, lessonsArray[currentLessonIndex]._id, changedElements.context.checked, 'TA'); 
					}					         
            }
        	}
			
        });	
		
		$('#summative_assessments_dropbox').searchableOptionList({
			data: convertToSolFormat(summativeAssessmentsArray),
			showSelectionBelowList: true,
			showSelectionContainer: $lesson_summative_assessments,
			maxHeight: '600px',
			showSelectAll: true,
			events: {            
            onChange: function(sol,changedElements) {
					if(changedElements.length == 1){
						setLessonParts(changedElements.context.value, lessonsArray[currentLessonIndex]._id, changedElements.context.checked, 'SA'); 
					}					         
            }
        	}
        });	
        
      $('#formative_assessments_dropbox').searchableOptionList({
			data: convertToSolFormat(formativeAssessmentsArray),
			showSelectionBelowList: true,
			showSelectionContainer: $lesson_formative_assessments,
			maxHeight: '600px',
			showSelectAll: true,
			events: {            
            onChange: function(sol,changedElements) {
					if(changedElements.length == 1){
						setLessonParts(changedElements.context.value, lessonsArray[currentLessonIndex]._id, changedElements.context.checked, 'FA'); 
					}					         
            }
        	}
        });	
	}
		
	convertToSolFormat = function (array) {
		for(var i = 0; i < array.length; i++){
			array[i].type = "option";
			array[i].value = array[i]._id;
			array[i].label = array[i].String;
			if(array[i].added){
				if(array[i].added.indexOf(lessonsArray[currentLessonIndex]._id) > -1){
						array[i].selected = true;
				}
				else{
					array[i].selected = false;			
				}
			}	
			
			
		}	
		
		return array;
	}

	clearLessonParts = function () {
			$lesson_learning_targets.empty();

			$lesson_task_activities.empty();

			$lesson_summative_assessments.empty();

			$lesson_formative_assessments.empty();
		}
      
	clearLessonPartsArrays = function () {
		learningTargetsArray.length = 0;
		activitiesArray.length = 0;
		summativeAssessmentsArray.length = 0;
		formativeAssessmentsArray.length = 0;
			
	}    
        
});
