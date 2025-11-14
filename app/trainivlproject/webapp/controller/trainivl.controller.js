sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";

    return Controller.extend("trainivlproject.controller.trainivl", {
        onInit() {
            // Create a JSON model to hold data
            const oJSONModel = new JSONModel();
            this.getView().setModel(oJSONModel, "employeeModel");

            // Get OData V4 model defined in manifest.json
            const oODataModel = this.getOwnerComponent().getModel();

            // Bind to Employees entity set
            const oBinding = oODataModel.bindList("/Employees");

            // Fetch the data
            oBinding.requestContexts().then((aContexts) => {
                const aEmployees = aContexts.map((oContext) => oContext.getObject());
                oJSONModel.setData({ employees: aEmployees });
                MessageToast.show("Employees loaded successfully!");
                console.log("Employees:", aEmployees);
            }).catch((oError) => {
                MessageToast.show("Error loading Employees data!");
                console.error(oError);
            });
        }
    });
});
