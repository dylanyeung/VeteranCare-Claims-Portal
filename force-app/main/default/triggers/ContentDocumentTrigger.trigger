//ContentDocumentLink does not always have a chance to fire when files are fully deleted as opposed to being removed from a record
//This trigger updates the file count on claims when files are fully deleted from a record.

trigger ContentDocumentTrigger on ContentDocument (after delete) {
    Set<Id> deletedFileIds = new Set<Id>();
    Set<Id> claimDocumentIds = new Set<Id>();
    Set<Id> claimIds = new Set<Id>();

    // Collect IDs of deleted files
    for (ContentDocument cd : Trigger.old) {
        deletedFileIds.add(cd.Id);
    }

    if (!deletedFileIds.isEmpty()) {
        // Get previously linked Claim_Document__c IDs (including deleted records)
        List<ContentDocumentLink> links = [
            SELECT LinkedEntityId FROM ContentDocumentLink 
            WHERE ContentDocumentId IN :deletedFileIds ALL ROWS
        ];

        for (ContentDocumentLink link : links) {
            claimDocumentIds.add(link.LinkedEntityId);
        }

        if (!claimDocumentIds.isEmpty()) {
            // Get related Claim__c IDs from Claim_Document__c
            List<Claim_Document__c> claimDocs = [
                SELECT Id, Related_Claim__c FROM Claim_Document__c 
                WHERE Id IN :claimDocumentIds
            ];

            for (Claim_Document__c claimDoc : claimDocs) {
                if (claimDoc.Related_Claim__c != null) {
                    claimIds.add(claimDoc.Related_Claim__c);
                }
            }

            if (!claimIds.isEmpty()) {
                List<Claim__c> claimsToUpdate = new List<Claim__c>();

                // Recalculate the file count for each Claim
                for (Id claimId : claimIds) {
                    Integer fileCount = [
                        SELECT COUNT()
                        FROM ContentDocumentLink
                        WHERE LinkedEntityId IN (
                            SELECT Id FROM Claim_Document__c WHERE Related_Claim__c = :claimId
                        )
                    ];

                    claimsToUpdate.add(new Claim__c(Id = claimId, File_Count__c = fileCount));
                }

                if (!claimsToUpdate.isEmpty()) {
                    try {
                        update claimsToUpdate; // Update the Claim's File_Count__c field
                    } catch (Exception e) {
                        System.debug('Trigger Error: ' + e.getMessage());
                    }
                }
            }
        }
    }
}
