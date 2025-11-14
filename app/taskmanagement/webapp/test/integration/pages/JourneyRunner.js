sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"taskmanagement/test/integration/pages/TasksList",
	"taskmanagement/test/integration/pages/TasksObjectPage"
], function (JourneyRunner, TasksList, TasksObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('taskmanagement') + '/test/flp.html#app-preview',
        pages: {
			onTheTasksList: TasksList,
			onTheTasksObjectPage: TasksObjectPage
        },
        async: true
    });

    return runner;
});

