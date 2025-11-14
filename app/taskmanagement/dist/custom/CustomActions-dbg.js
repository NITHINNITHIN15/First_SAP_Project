sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button"
], function (BusyIndicator, MessageToast, Dialog, Text, List, StandardListItem, Button) {
    "use strict";

    return {
        // ---------- LOAD ----------
        Load: function () {
            BusyIndicator.show(100);

            $.ajax({
                url: "/odata/v4/task/Tasks",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    BusyIndicator.hide();
                    console.log("Response Data:", data);
                    MessageToast.show("Data fetched successfully!");
                },
                error: function (xhr, status, error) {
                    BusyIndicator.hide();
                    console.error("Error:", error);
                    MessageToast.show("Failed to fetch data.");
                }
            });
        },

        // ---------- SHOW ----------
        Show: function () {
            var payload = {
                title: "Task from Fiori Action",
                description: "Triggered from Show button"
            };

            BusyIndicator.show(100);

            $.ajax({
                url: "/odata/v4/task/createTask",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(payload),
                success: function (response) {
                    BusyIndicator.hide();
                    console.log("Action Response:", response);
                    MessageToast.show("Custom action executed successfully!");
                },
                error: function (xhr, status, error) {
                    BusyIndicator.hide();
                    console.error("Action Error:", error);
                    MessageToast.show("Action failed.");
                }
            });
        },

        // ---------- ACCESS ----------
        Access: function () {
            BusyIndicator.show(100);

            $.ajax({
                url: "/odata/v4/task/Tasks",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    BusyIndicator.hide();
                    console.log("Fetched Data:", data);

                    var results = data.value || [];

                    // Sort alphabetically by title
                    results.sort(function (a, b) {
                        return a.title.localeCompare(b.title);
                    });

                    // Create a List with the data
                    var oList = new List({
                        items: results.map(function (item) {
                            return new StandardListItem({
                                title: item.title,
                                description: item.description
                            });
                        })
                    });

                    // Create main dialog with Submit + Close buttons
                    var oDialog = new Dialog({
                        title: "Sorted Task List",
                        contentWidth: "400px",
                        contentHeight: "400px",
                        content: [oList],

                        buttons: [
                            new Button({
                                text: "Submit",
                                type: "Emphasized",
                                press: function () {
                                    if (results.length === 0) {
                                        MessageToast.show("No data to submit!");
                                        return;
                                    }

                                    // Get the first row's ID
                                    var firstTask = results[0];
                                    var firstTaskId = firstTask.ID;

                                    var payload = {
                                        taskId: firstTaskId
                                    };

                                    console.log("Payload to Submit:", payload);
                                    BusyIndicator.show(100);

                                    // Send POST request
                                    $.ajax({
                                        url: "/odata/v4/task/submitTask",
                                        type: "POST",
                                        contentType: "application/json",
                                        data: JSON.stringify(payload),
                                        success: function (response) {
                                            BusyIndicator.hide();
                                            console.log("Submit Response:", response);

                                            oDialog.close(); // close main list dialog

                                            // ✅ Show result in a new Dialog
                                            var successMessage = `Task "${firstTask.title}" (ID: ${firstTaskId}) submitted successfully!`;

                                            var oSuccessDialog = new Dialog({
                                                title: "Submission Result",
                                                type: "Message",
                                                content: new Text({ text: successMessage }),
                                                beginButton: new Button({
                                                    text: "OK",
                                                    type: "Emphasized",
                                                    press: function () {
                                                        oSuccessDialog.close();
                                                    }
                                                }),
                                                afterClose: function () {
                                                    oSuccessDialog.destroy();
                                                }
                                            });

                                            oSuccessDialog.open();
                                        },
                                        error: function (xhr, status, error) {
                                            BusyIndicator.hide();
                                            console.error("Submit Error:", error);

                                            var oErrorDialog = new Dialog({
                                                title: "Submission Failed",
                                                type: "Message",
                                                content: new Text({ text: "Failed to submit task. Please try again." }),
                                                beginButton: new Button({
                                                    text: "OK",
                                                    press: function () {
                                                        oErrorDialog.close();
                                                    }
                                                }),
                                                afterClose: function () {
                                                    oErrorDialog.destroy();
                                                }
                                            });

                                            oErrorDialog.open();
                                        }
                                    });
                                }
                            }),
                            new Button({
                                text: "Close",
                                press: function () {
                                    oDialog.close();
                                }
                            })
                        ],

                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                },
                error: function (xhr, status, error) {
                    BusyIndicator.hide();
                    console.error("Access Error:", error);
                    MessageToast.show("Failed to load data for dialog.");
                }
            });
        }
    };
});
