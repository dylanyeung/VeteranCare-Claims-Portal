public with sharing class VeteranLoginRedirectController {
    public VeteranLoginRedirectController() {
        User currentUser = [SELECT Id, Profile.Name FROM User WHERE Id = :UserInfo.getUserId()];

        // Check if the user is a veteran
        if (currentUser.Profile.Name == 'VeteranCare Portal Access') {
            // Redirect logic is handled via JavaScript for session storage
        }
    }
}