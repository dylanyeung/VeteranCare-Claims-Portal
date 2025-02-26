public with sharing class FileCountUtility {

    @InvocableMethod(label='Get File Count' description='Returns the number of files linked to a Claim Document')
    public static List<Integer> getFileCount(List<Id> claimDocumentIds) {
        List<Integer> fileCounts = new List<Integer>();

        //For each claim document ID passed in, get the number of files attached
        for (Id claimDocumentId : claimDocumentIds) {
            Integer fileCount = [
                SELECT COUNT()
                FROM ContentDocumentLink
                WHERE LinkedEntityId = :claimDocumentId
            ];
            fileCounts.add(fileCount);
        }
        return fileCounts;
    }
}