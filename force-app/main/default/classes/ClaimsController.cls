public with sharing class ClaimsController {
    @AuraEnabled(cacheable=true)
    public static List<Claim__c> getVeteranClaims() {
        Id userId = UserInfo.getUserId();
        
        // Get the Veteran associated with the logged-in user
        List<Veteran__c> veterans = [SELECT Id FROM Veteran__c WHERE Veteran_User__c = :userId LIMIT 1];
        
        if (veterans.isEmpty()) {
            return new List<Claim__c>(); // Return an empty list if no Veteran is found
        }
        
        Id veteranId = veterans[0].Id;

        // Fetch claims for the veteran including RecordType.DeveloperName
        return [
            SELECT Id, RecordType.DeveloperName, Current_Status__c, Benefit_Level__c, CreatedDate
            FROM Claim__c
            WHERE Veteran__c = :veteranId
        ];
    }
}