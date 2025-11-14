sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/SearchField",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BusyIndicator, MessageToast, Dialog, Text, Button, Table, Column, ColumnListItem, Label, SearchField, JSONModel, Filter, FilterOperator) {
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

                    // --- JSON Model ---
                    var oModel = new JSONModel();
                    oModel.setData({ Tasks: results });

                    // --- Table ---
                    var oTable = new Table({
                        inset: false,
                        columns: [
                            new Column({ header: new Label({ text: "Title" }) }),
                            new Column({ header: new Label({ text: "Description" }) }),
                            new Column({ header: new Label({ text: "Status" }) })
                        ]
                    });

                    oTable.bindItems({
                        path: "/Tasks",
                        template: new ColumnListItem({
                            cells: [
                                new Text({ text: "{title}" }),
                                new Text({ text: "{description}" }),
                                new Text({ text: "{status}" })
                            ]
                        })
                    });

                    oTable.setModel(oModel);

                    // --- Search Field (Filter) ---
                    var oSearchField = new SearchField({
                        width: "80%",
                        placeholder: "Search ...",
                        liveChange: function (oEvent) {
                            var sQuery = oEvent.getParameter("newValue");
                            var oBinding = oTable.getBinding("items");

                            if (sQuery && sQuery.length > 0) {
                                // Create multiple filters (Title + Description + Status)
                                var oCombinedFilter = new Filter({
                                    filters: [
                                        new Filter("title", FilterOperator.Contains, sQuery),
                                        new Filter("status", FilterOperator.Contains, sQuery)
                                    ],
                                    and: false // false means OR condition
                                });

                                oBinding.filter([oCombinedFilter]);
                            } else {
                                oBinding.filter([]); // clear filters
                            }
                        }
                    });

                    // --- Main Dialog ---
                    var oDialog = new Dialog({
                        title: "Filtered Task Table",
                        contentWidth: "600px",
                        contentHeight: "500px",
                        verticalScrolling: true,
                        content: [
                            oSearchField,
                            oTable
                        ],
                        buttons: [
                            new Button({
                                text: "Submit",
                                type: "Emphasized",
                                press: function () {
                                    var aFilteredData = oModel.getProperty("/Tasks");
                                    if (aFilteredData.length === 0) {
                                        MessageToast.show("No data to submit!");
                                        return;
                                    }

                                    var firstTask = aFilteredData[0];
                                    var firstTaskId = firstTask.ID;

                                    var payload = { taskId: firstTaskId };

                                    console.log("Payload to Submit:", payload);
                                    BusyIndicator.show(100);

                                    $.ajax({
                                        url: "/odata/v4/task/submitTask",
                                        type: "POST",
                                        contentType: "application/json",
                                        data: JSON.stringify(payload),
                                        success: function (response) {
                                            BusyIndicator.hide();
                                            console.log("Submit Response:", response);

                                            oDialog.close();

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
        },

        
        // ---------- EMPLOYEE DETAILS ----------
onEmployeeDetails: function () {
    BusyIndicator.show(100);

    $.ajax({
        url: "/odata/v4/task/Employees", // Adjust service path if needed
        type: "GET",
        dataType: "json",
        success: function (data) {
            BusyIndicator.hide();
            console.log("Employee Data:", data);

            var results = data.value || [];

            // --- JSON Model ---
            var oModel = new JSONModel();
            oModel.setData({ Employees: results });

            // --- Table ---
            var oTable = new Table({
                inset: false,
                columns: [
                    new Column({ header: new Label({ text: "Name" }) }),
                    new Column({ header: new Label({ text: "Designation" }) }),
                    new Column({ header: new Label({ text: "Email" }) })
                ]
            });

            oTable.bindItems({
                path: "/Employees",
                template: new ColumnListItem({
                    type: "Active",
                    press: function (oEvent) {
                        // when user clicks on a row → show details
                        var oContext = oEvent.getSource().getBindingContext();
                        var oEmployee = oContext.getObject();

                        var oDetailsDialog = new Dialog({
                            title: "Employee Details",
                            type: "Message",
                            contentWidth: "400px",
                            content: [
                                new Text({ text: `Name: ${oEmployee.name}` }),
                                new Text({ text: `Designation: ${oEmployee.designation}` }),
                                new Text({ text: `Email: ${oEmployee.email}` })
                            ],
                            beginButton: new Button({
                                text: "Close",
                                press: function () {
                                    oDetailsDialog.close();
                                }
                            }),
                            afterClose: function () {
                                oDetailsDialog.destroy();
                            }
                        });

                        oDetailsDialog.open();
                    },
                    cells: [
                        new Text({ text: "{name}" }),
                        new Text({ text: "{designation}" }),
                        new Text({ text: "{email}" })
                    ]
                })
            });

            oTable.setModel(oModel);

            // --- Search Field (optional) ---
            var oSearchField = new SearchField({
                width: "80%",
                placeholder: "Search Employees ...",
                liveChange: function (oEvent) {
                    var sQuery = oEvent.getParameter("newValue");
                    var oBinding = oTable.getBinding("items");

                    if (sQuery && sQuery.length > 0) {
                        var oCombinedFilter = new Filter({
                            filters: [
                                new Filter("name", FilterOperator.Contains, sQuery),
                                new Filter("designation", FilterOperator.Contains, sQuery),
                                new Filter("email", FilterOperator.Contains, sQuery)
                            ],
                            and: false
                        });
                        oBinding.filter([oCombinedFilter]);
                    } else {
                        oBinding.filter([]);
                    }
                }
            });

            // --- Main Dialog ---
            var oDialog = new Dialog({
                title: "Employee Directory",
                contentWidth: "600px",
                contentHeight: "500px",
                verticalScrolling: true,
                content: [
                    oSearchField,
                    oTable
                ],
                buttons: [
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
            console.error("Error fetching employees:", error);
            MessageToast.show("Failed to fetch employee data.");
        }
    });
},



        // ---------- ADD EMPLOYEE ----------
        onTaskDetails: function () {
            MessageToast.show("Show Task Details button clicked!");
        }
    };
});
