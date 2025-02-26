public with sharing class VfDynamicObjectSearchController {
    public String selectedObject { get; set; }
    public List <SelectOption> objectOptions {
        get {
            if(objectOptions == null){
                List<SelectOption> options = new List<SelectOption>();
                options.add(new SelectOption('Account', 'Account'));
                //selectionoption = label, name
                options.add(new SelectOption('Contact', 'Contact'));
                options.add(new SelectOption('Course__c', 'Course__c'));
                return options;
            }
            else {
                return objectOptions;
            } 
        }
        //no setter = read only property
    }
    //Map is going to store the label and name for each record (each map is its own record)
    //List contains all the records
    public List<Map<String, String>> records { get; set; }


    public void fetchRecords(){
        records = new List<Map<String, String>>();
        List<SObject> queryResults = new List<SObject>();

        //retrieve records
        if(selectedObject == 'Account') {
            queryResults = [SELECT Id, Name FROM Account];
        }
        else if(selectedObject == 'Contact'){
            queryResults = [SELECT Id, Name FROM Contact];
        }
        else if(selectedObject == 'Course__c'){
            queryResults = [SELECT Id, Name FROM Course__c];
        }

        for(SObject obj : queryResults){
            Map<String, String> recordsMap = new Map<String, String>();
            recordsMap.put('Name', (String) obj.get('Name'));
            recordsMap.put('Id', (String) obj.get('Id'));
            
            records.add(recordsMap);

        }
    }


}