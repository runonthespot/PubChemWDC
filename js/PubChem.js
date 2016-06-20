(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        
        var cols = [
          {
              id: "x",
              alias: "x",
              dataType: tableau.dataTypeEnum.float
          }, 
          {
              id: "y",
              alias: "y",
              dataType: tableau.dataTypeEnum.float
          }, 
          {
              id: "z",
              alias: "z",
              dataType: tableau.dataTypeEnum.float
          }, 
          {
              id: "path_id",
              alias: "path_id",
              dataType: tableau.dataTypeEnum.float
          }, 
          {
              id: "bond_id",
              alias: "bond_id",
              dataType: tableau.dataTypeEnum.float
          }, 
          {
              id: "bond_order",
              alias: "bond_order",
              dataType: tableau.dataTypeEnum.float
          }, 
          {
              id: "CompoundName",
              alias: "CompoundName",
              dataType: tableau.dataTypeEnum.string
          }, 
          {
              id: "AtomicNumber",
              alias: "AtomicNumber",
              dataType: tableau.dataTypeEnum.string
          }, 
          {
              id: "degrees",
              alias: "degrees",
              dataType: tableau.dataTypeEnum.int
          },
          {
              id: "radians",
              alias: "radians",
              dataType: tableau.dataTypeEnum.float
          }

        ];

    
        var tableCompound = 
        {
          id: "CompoundTable", 
          alias: "CompoundTable",
          desc: tableau.connectionData,
          columns: cols
        };

        schemaCallback([tableCompound]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        
      var apiCall = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+encodeURIComponent(table.tableInfo.desc)+'/json?record_type=3d';  

      $.getJSON(apiCall, function(data) {

        var tableData = [];

        var coordinates = data.PC_Compounds[0].coords[0].conformers[0];
        var bonds = data.PC_Compounds[0].bonds;
        var elements = data.PC_Compounds[0].atoms.element;
     
        //Create both ends of each bond using the xyz coordinates of the 3d conformers
        //Also did the cross-join with a table of degrees in here because current Tableau 10 beta multi-table cross join isn't working with web connector.

        for (deg = 0; deg < 360; deg++)
        {
          for (i = 0; i < bonds.aid1.length; i++) {
            var entry = {
                          'x':coordinates.x[bonds.aid1[i]-1],
                          'y':coordinates.y[bonds.aid1[i]-1],
                          'z':coordinates.z[bonds.aid1[i]-1],
                          'path_id':1,
                          'bond_id':i,
                          'bond_order':bonds.order[i],
                          'CompoundName':table.tableInfo.desc,
                          'AtomicNumber':elements[bonds.aid1[i]-1],
                          'degrees':deg,
                          'radians':deg/180 * Math.PI
                       };
            tableData.push(entry);
            entry = {
                          'x':coordinates.x[bonds.aid2[i]-1],
                          'y':coordinates.y[bonds.aid2[i]-1],
                          'z':coordinates.z[bonds.aid2[i]-1],
                          'path_id':2,
                          'bond_id':i,
                          'bond_order':bonds.order[i],
                          'CompoundName':table.tableInfo.desc,
                          'AtomicNumber':elements[bonds.aid2[i]-1],
                          'degrees':deg,
                          'radians':deg/180 * Math.PI
                    };                             
            tableData.push(entry);
          }
        }
        table.appendRows(tableData);
        doneCallback();
      });
      
    };

    tableau.registerConnector(myConnector);

   $(document).ready(function() {
      $("#submitButton").click(function() { // This event fires when a button is clicked
        
       var CompoundName = $('input[type=text]').val().trim();
        if (CompoundName) {
          tableau.connectionData = CompoundName;
          tableau.connectionName = "PubChem compound feed";
          tableau.submit();
        }
      });
    });

   
})();
