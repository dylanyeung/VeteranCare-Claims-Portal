public with sharing class ClaimDocumentController {
    @AuraEnabled(cacheable=true)
    public static Id getClaimDocumentId(String claimType) {
        // Get the current user's ID
        Id currentUserId = UserInfo.getUserId();

        // Convert claimType to match stored record values
        String formattedClaimType = claimType.replace('_', ' ');

        System.debug('🔍 Claim Type Being Queried: ' + formattedClaimType);
        System.debug('🔍 Current Running User ID: ' + currentUserId);

        // Find the most recent active Claim (not Denied) for the current user
        List<Claim__c> claims = [
            SELECT Id FROM Claim__c 
            WHERE Claim_Type__c = :formattedClaimType 
            AND Current_Status__c != 'Denied'
            AND Veteran__r.Veteran_User__c = :currentUserId
            ORDER BY CreatedDate DESC 
            LIMIT 1
        ];

        if (claims.isEmpty()) {
            System.debug('No open claims found for this claim type.');
            return null; 
        }

        System.debug('Found Claim: ' + claims[0].Id);

        // Find the associated Claim Document for the found Claim
        List<Claim_Document__c> claimDocs = [
            SELECT Id FROM Claim_Document__c 
            WHERE Related_Claim__c = :claims[0].Id 
            LIMIT 1
        ];

        if (claimDocs.isEmpty()) {
            System.debug('No Claim Document found for Claim ID: ' + claims[0].Id);
            return null;
        }

        System.debug('Found Claim Document: ' + claimDocs[0].Id);
        return claimDocs[0].Id;
    }
}
