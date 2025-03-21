public class CourseManager {

    /**
    *  This class contains methods used to manage
    *  records in the Course object
    */

    public static Set<Course__c> findDuplicates(List<Course__c> oldCourseList, List<Course__c> newCourseList) {

        /** TODO #1: Declare a variable whose type is a Set of Course__c sObjects
         * named courseDuplicatesSet and initialize it to a newly constructed
         * Set of Course__c sObjects, passing in no parameters
         */

         Set<Course__c> courseDuplicatesSet = new Set<Course__c>();


        /** TODO #2: Create a for loop with an iterator of type Course__c named 
         * newCourse that iterates over the List newCourseList (from the
         * input parameter of the method).  Within the for loop:
         * -- Call the contains method for the oldCourseList variable and 
         *    pass in the value of the newCourse variable
         * -- If the oldCourseList contains the value of newCourse:
         * -- Call the add method for the courseDuplicatesSet variable 
         *    and pass in the value of the newCourse variable
         */

        for(Course__c x : newCourseList){
            if(oldCourseList.contains(x)){
                courseDuplicatesSet.add(x);
            }
        }
        /** TODO #3: Return the courseDuplicatesSet variable
         */
        
        return courseDuplicatesSet;

    }
}