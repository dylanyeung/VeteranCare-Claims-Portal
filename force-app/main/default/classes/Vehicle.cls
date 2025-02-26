/**
 * ABSTRACT
 *   - can be used to make a "blueprint"
 *   - a class that *can* have abstract methods
 *      - methods that are declared in parent but defined in child
 * 
 */


public abstract class Vehicle {

    private Integer numWheels;

    public Vehicle(Integer numWheels) {
        this.numWheels = numWheels;
    }

    //getters and setters
    public Integer getNumWheels() {
        return this.numWheels;
    }

    public void setNumWheels(Integer numWheels) {
        this.numWheels = numWheels;
    }
    
    // abstract method for how a vehicle is started
    public abstract void start();
}