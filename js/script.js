Parse.initialize("H3c8Uo3jptrNv50UgLwEfuboWMf2gmuiRpm0tAHd", "70aaWyTOlBlwtZONMW1NRZLUzGebYeD5cJS0SYBt");

$( "#newLineForm" ).submit(function(e) {
	e.preventDefault();

	var form = e.target;

	var data = {
		TwilioNumber: form.TwilioNumber.value,
		ChefName: form.ChefName.value,
		ChefNumber: form.ChefNumber.value,
		CustomerName: form.CustomerName.value,
		CustomerNumber: form.CustomerNumber.value,
		isActive: true,
		Thread: " "
	};

	var TempGroup = Parse.Object.extend("TempGroup");
    var tg = new TempGroup();
    tg.save(data)
      .then(function(){
      		alert("The new line has been created!");
      		renderOpenLines();
      });
});

var confirmDeactivate = function(e) {
	result = window.confirm("Are you sure you want to deactivate this line?");
	if(result) {
		var TempGroup = Parse.Object.extend("TempGroup");
		var query = new Parse.Query(TempGroup);
		query.get(e.target.attributes['data-id'].value, {
			success: function(theObject) {
				theObject.set("isActive", false);
				theObject.save();
				renderOpenLines();
			},
			error: function(error) {
				console.log("Error deactivating this line: " + error);
			}
		});
		
		e.preventDefault();
    }
}

var confirmActivate = function(e) {
	var TempGroup = Parse.Object.extend("TempGroup");
	var query = new Parse.Query(TempGroup);
	query.get(e.target.attributes['data-id'].value, {
		success: function(theObject) {
			theObject.set("isActive", true);
			theObject.save();
			alert("This line has been activated!");
			renderOpenLines();
		},
		error: function(error) {
			console.log("Error deactivating this line: " + error);
		}
	});
	
	e.preventDefault();
}

var confirmDestroy = function(e) {
	result = window.confirm("Are you sure you want to destroy this line?");
	if(result) {
		var TempGroup = Parse.Object.extend("TempGroup");
		var query = new Parse.Query(TempGroup);
		query.get(e.target.attributes['data-id'].value, {
			success: function(theObject) {
				theObject.destroy({
					success: function(obj) {
						alert("The line was destroyed!");
					},
					error: function(obj, err) { 
						console.log("Error deleting object: " + err); 
					}
				});
				renderOpenLines();
			},
			error: function(error) {
				console.log("Error destroying this line: " + error);
			}
		});
		
		e.preventDefault();
    }
}

var renderOpenLines = function() {
	 // Render rows for open questions
    var TempGroup = Parse.Object.extend("TempGroup");
    var query = new Parse.Query(TempGroup);
    query.descending("createdAt");

    query.find({
    	success: function(results) {
    		var table = $("<table />").addClass("table").addClass("table-striped");

            // Header row
            var headerRow = $("<tr />");
            $("<th />", { text: "Twilio Number" }).appendTo(headerRow);
            $("<th />", { text: "Customer Name" }).appendTo(headerRow);
            $("<th />", { text: "Customer Phone" }).appendTo(headerRow);
            $("<th />", { text: "Chef Name" }).appendTo(headerRow);
            $("<th />", { text: "Chef Phone" }).appendTo(headerRow);
            $("<th />", { text: "Active?" }).appendTo(headerRow);
            $("<th />", { text: "Actions" }).appendTo(headerRow);

            var header = $("<thead />");
            headerRow.appendTo(header);
            header.appendTo(table);

            $.each(results, function(index, result) {

            	var dataRow = $("<tr />");
                $("<td />", { text: result.attributes.TwilioNumber }).appendTo(dataRow);
                $("<td />", { text: result.attributes.CustomerName }).appendTo(dataRow);
                $("<td />", { text: result.attributes.CustomerNumber }).appendTo(dataRow);
                $("<td />", { text: result.attributes.ChefName }).appendTo(dataRow);
                $("<td />", { text: result.attributes.ChefNumber }).appendTo(dataRow);
                $("<td />", { text: result.attributes.isActive }).appendTo(dataRow);

                var deactivateButton = $("<button />", {
                    text: "Deactivate",
                    type: "button",
                    "data-id": result.id,
                    "class": "btn btn-default btn-xs",
                    click: confirmDeactivate
                });

                var activateButton = $("<button />", {
                    text: "Activate",
                    type: "button",
                    "data-id": result.id,
                    "class": "btn btn-default btn-xs",
                    click: confirmActivate
                });

                var destroyButton = $("<button />", {
                    text: "Destroy",
                    type: "button",
                    "data-id": result.id,
                    "class": "btn btn-default btn-xs",
                    click: confirmDestroy
                });

                var actionCell = $("<td />");
                result.attributes.isActive ? 
                	deactivateButton.appendTo(actionCell) : activateButton.appendTo(actionCell);
                destroyButton.appendTo(actionCell);
                actionCell.appendTo(dataRow);
                dataRow.appendTo(table);

            });

            var activeLinesDiv = $("#activeLines");
            activeLinesDiv.empty();
            table.appendTo(activeLinesDiv);
    	},
    	error: function(error) {
    		alert("Error: " + error.code + " " + error.message);
    	}
    });
}

renderOpenLines();

