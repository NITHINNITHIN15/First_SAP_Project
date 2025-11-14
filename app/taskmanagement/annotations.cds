using TaskService as service from '../../srv/task-service';


annotate service.Projects with @(UI: {
  HeaderInfo         : {
    TypeName      : 'Project',
    TypeNamePlural: 'Projects',
    Title         : {Value: projectName},
    Description   : {Value: startDate}
  },

  SelectionFields    : [
    projectName,
    startDate,
    endDate
  ],

  LineItem           : [
    {
      Value: projectName,
      Label: 'Project Nameeeeeeeeiiiii',
      width:'50rem'
    },
    {
      Value: startDate,
      Label: 'Start Dateeeeeeeeiiii',
      width: '70rem'
    },
    {
      Value: endDate,
      Label: 'End Dateeeeeeeiiiiie',
      width: '20rem'
    }
  ],

  FieldGroup #General: {Data: [
    {
      Value: projectName,
      Label: 'Project Name'
    },
    {
      Value: startDate,
      Label: 'Start Date'
    },
    {
      Value: endDate,
      Label: 'End Date'
    }
  ]},
  Facets             : [
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'General Information',
      Target: '@UI.FieldGroup#General'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Employees',
      Target: 'employees/@UI.LineItem'
    },
  // {
  //   $Type: 'UI.ReferenceFacet',
  //   Label: 'Tasks',
  //   Target: 'tasks/@UI.LineItem'
  // }
  ]
}
);


annotate service.Employees with @(UI: {
  HeaderInfo         : {
    TypeName      : 'Employee',
    TypeNamePlural: 'Employees',
    Title         : {Value: name},
    Description   : {Value: designation}
  },
  LineItem           : [
    {
      Value: name,
      Label: 'Name',
      width: '25rem'
    },
    {
      Value: designation,
      Label: 'Designation',
      width: '25rem'
    },
    {
      Value: email,
      Label: 'Email',
      width: '25rem'
    },
    {
      Value: project.projectName,
      Label: 'Project',
      width: '22rem'
    }
  ],
  FieldGroup #General: {Data: [
    {
      Value: name,
      Label: 'Employee Name'
    },
    {
      Value: designation,
      Label: 'Designation'
    },
    {
      Value: email,
      Label: 'Email'
    },
    {
      Value: project.projectName,
      Label: 'Project'
    }
  ]},

  Facets             : [
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'General Information',
      Target: '@UI.FieldGroup#General'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Tasks Assigned',
      Target: 'tasks/@UI.LineItem'
    }
  ]

});


annotate service.Tasks with @(UI: {
  HeaderInfo         : {
    TypeName      : 'Task',
    TypeNamePlural: 'Tasks',
    Title         : {Value: title},
    Description   : {Value: status}
  },
  LineItem           : [
    {
      Value: title,
      Label: 'Title',
      width: '22rem'
    },
    {
      Value: description,
      Label: 'Description',
      width: '22rem'
    },
    {
      Value      : status,
      Label      : 'Status',
      Criticality: criticality,
      width      : '22rem'
    },
    {
      Value: dueDate,
      Label: 'Due Date',
      width: '22rem'
    },
    {
      Value: assignedTo.name,
      Label: 'Assigned To',
      width: '22rem'
    },
    {
      Value: project.projectName,
      Label: 'Project',
      width: '22rem'
    }
  ],
  FieldGroup #Details: {Data: [
    {
      Value: title,
      Label: 'Title'
    },
    {
      Value: description,
      Label: 'Description'
    },
    {
      Value      : status,
      Label      : 'Status',
      Criticality: criticality
    },
    {
      Value: dueDate,
      Label: 'Due Date'
    },
    {
      Value: assignedTo.name,
      Label: 'Assigned To'
    },
    {
      Value: project.projectName,
      Label: 'Project'
    }
  ]},
  Facets             : [{
    $Type : 'UI.ReferenceFacet',
    Label : 'Task Details',
    Target: '@UI.FieldGroup#Details'
  }]
});
