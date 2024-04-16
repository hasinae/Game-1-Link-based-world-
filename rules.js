class Start extends Scene 
{
    create() 
    {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() 
    {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene 
{
    create(key) 
    {
        let locationData = this.engine.storyData.Locations[key];

        this.engine.show(locationData.Body);

        if (locationData.Choices) 
        {
            for (let choice of locationData.Choices) 
            {
                this.engine.addChoice(choice.Text, choice);
            }
        } 
        else 
        {
            this.engine.addChoice("The end.")
        }

        // Location-specific interactive mechanism
        if (locationData.SpecialMechanism === "Magical Fountain") 
        {
            this.engine.show("You notice a mystical fountain nearby, radiating with magical energy.");
            this.engine.addChoice("Activate the fountain", "Activate Fountain");
        }

        // lock and key puzzle
        // if (locationData.Lock) 
        // {
        //     this.engine.show("You see a " + locationData.Lock + " blocking your way.");
        // }

        // let lockedExit = this.engine.storyData.LockedExits[key];
        
        // if (lockedExit) 
        // {
        //     let lockedExitData = this.engine.storyData.Locations[lockedExit["Tower of Magi"]];
        //     let keyLocation = this.engine.storyData.KeyLocations[lockedExit["Key"]];

        //     if (keyLocation === key) 
        //     {
        //         this.engine.addChoice("Unlock the " + lockedExit.Direction, lockedExit.Direction);
        //     } 
        //     else 
        //     {
        //         this.engine.show("The " + lockedExit.Direction + " is locked.");
        //     }
        // }

        let lockedExit = this.engine.storyData.LockedExits[key];

        if (lockedExit) {
            let lockedExitData = this.engine.storyData.Locations[key]; // Retrieve the locked exit data using the current location key
            let keyLocation = this.engine.storyData.KeyLocations[lockedExit.Key]; // Retrieve the location where the key is located
            
            if (keyLocation === key) {
                this.engine.addChoice("Unlock the " + lockedExit.Direction, "Unlock " + key); // Provide an option to unlock the exit
            } else {
                this.engine.show("The " + lockedExit.Direction + " is locked.");
            }
        }
        

    }


    handleChoice(choice) 
    {
         if (choice === "Activate Fountain") 
        {
            this.engine.show("You activate the mystical fountain and feel a surge of magical energy going through you.");
            this.engine.addChoice("Explore the courtyard", "Explore Courtyard");
            this.engine.addChoice("Return to the Great Hall", "Great Hall");
            this.engine.player.magicalBoost = true; 
            
            setTimeout(() => {
                this.engine.player.magicalBoost = false;
            }, 10000); // reverts powers back to normal after 10sec

        }
        else if (choice === "Explore Courtyard") 
        {
            // this.engine.gotoScene(Location, locationData);
            this.engine.gotoScene(Location, "Courtyard");
        } 
        else if (choice === "Great Hall") 
        {
            this.engine.gotoScene(Location, "Great Hall");

        }
        if (choice === "Unlock the Ascend") 
        {
            let lockedExit = this.engine.storyData.LockedExits["Tower of Magi"];

            let directionToUnlock = lockedExit.Direction;
            let locationToUnlock = lockedExit.Target;

            let locationData = this.engine.storyData.Locations[locationToUnlock];

            for (let i = 0; i < locationData.Choices.length; i++) 
            {
                if (locationData.Choices[i].Text === directionToUnlock) 
                {
                    locationData.Choices.splice(i, 1); 
                    break;
                }
            }

            this.engine.show("You successfully unlock the " + directionToUnlock + ". You can now proceed.");

            this.engine.gotoScene(Location, locationToUnlock);
        }
        else if(choice) 
        {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } 
        else
        {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}


Engine.load(Start, 'myStory.json');