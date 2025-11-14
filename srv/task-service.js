const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Tasks } = this.entities;

  // -------- ACTION: postTask --------
  this.on("createTask", async (req) => {
    const { title,description } = req.data;
    
    if (!title) {
      req.error(400, "Project Name  is required");
    } else {
      return { message: `Project ${title} submitted successfully.` };
    }
  });
  


  // -------- ACTION: submitTask --------
  this.on('submitTask', async (req) => {
    const { taskId } = req.data;

    if (!taskId) return req.error(400, 'Task ID is missing');

    const task = await SELECT.one.from(Tasks).where({ ID: taskId });
    if (!task) return req.error(404, `Task with ID ${taskId} not found`);

    console.log(`✅ Task submitted: ${task.title}`);

    // Optional DB update
    // await UPDATE(Tasks).set({ status: 'S' }).where({ ID: taskId });

    return `Task "${task.title}" (ID: ${taskId}) submitted successfully`;
  });

  

  // -------- AFTER READ: Add Criticality --------
  this.after('READ', Tasks, each => {
    if (each.status) {
      switch (each.status) {
        case 'I':
          each.status = 'In Progress';
          each.criticality = 2; // Yellow
          break;
        case 'P':
          each.status = 'Pending';
          each.criticality = 1; // Red
          break;
        case 'C':
          each.status = 'Completed';
          each.criticality = 3; // Green
          break;
        default:
          each.status = 'Unknown';
          each.criticality = 0;
          break;
      }
    }
  });
});

