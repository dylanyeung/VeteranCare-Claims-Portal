//Trigger that handles updates to claim object's file count field when related claim document has a file uploaded or removed from record

trigger ContentDocumentLinkTrigger on ContentDocumentLink (after insert, after delete) {
    Set<Id> claimDocumentIds = new Set<Id>();
    Set<Id> claimIds = new Set<Id>();

    // Collect Claim Document IDs from newly inserted or deleted ContentDocumentLink records
    for (ContentDocumentLink cdl : Trigger.isInsert ? Trigger.new : Trigger.old) {
        if (cdl.LinkedEntityId != null) {
            claimDocumentIds.add(cdl.LinkedEntityId);
        }
    }

    if (!claimDocumentIds.isEmpty()) {
        // Query Claim Documents to find related Claim records
        Map<Id, Claim_Document__c> claimDocumentMap = new Map<Id, Claim_Document__c>(
            [SELECT Id, Related_Claim__c FROM Claim_Document__c WHERE Id IN :claimDocumentIds]
        );

        for (Claim_Document__c claimDoc : claimDocumentMap.values()) {
            if (claimDoc.Related_Claim__c != null) {
                claimIds.add(claimDoc.Related_Claim__c);
            }
        }

        if (!claimIds.isEmpty()) {
            List<Claim__c> claimsToUpdate = new List<Claim__c>();

            // Count the number of files for each Claim and update the file count field
            for (Id claimId : claimIds) {
                Integer fileCount = [
                    SELECT COUNT()
                    FROM ContentDocumentLink
                    WHERE LinkedEntityId IN (SELECT Id FROM Claim_Document__c WHERE Related_Claim__c = :claimId)
                ];

                claimsToUpdate.add(new Claim__c(Id = claimId, File_Count__c = fileCount));
            }

            if (!claimsToUpdate.isEmpty()) {
                try {
                    update claimsToUpdate; // Update the Claim with the correct file count
                } catch (Exception e) {
                    System.debug('Trigger Error: ' + e.getMessage());
                }
            }
        }
    }
}
