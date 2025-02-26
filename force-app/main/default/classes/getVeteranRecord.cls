public with sharing class getVeteranRecord {
    
    @AuraEnabled(cacheable=true)
    public static Veteran__c getVeteranInfo(Id userId){

        Veteran__c veteranInfo;
        try {
            List<Veteran__c> veteranRecords = [SELECT Id, First_Name__c, Last_Name__c, Credit_Score__c, Date_of_Birth__c, Disability_Percentage__c, Discharge_Status__c, Email__c, Military_Branch__c, Military_Service_End_Date__c, Military_Service_Start_Date__c, Social_Security_Number__c, Primary_Phone_Number__c
                            FROM Veteran__c 
                            WHERE Veteran_User__c =: userId];

            if (!veteranRecords.isEmpty()) {
                veteranInfo = veteranRecords[0];
            } else {
                veteranInfo = new Veteran__c();
            }
        } catch (Exception e) {
            throw new AuraHandledException('Unable to retrieve Veteran Record ' + e.getMessage());
        }
        return veteranInfo;
    }
}