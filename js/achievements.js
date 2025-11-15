class Achievement
    {
        constructor(name, description, visible, level, pointsToBoost, attributeToBoost){ 

        this.name = name;
        this.description = description;
        this.visible = visible;
        this.level = level;
        this.pointsToBoost = pointsToBoost;
        this.attributesToBoost = attributesToBoost;

        /*public Achievement(string name, string description, int level, int pointsToBoost, string attributeToBoost)
        {
            Name = name;
            Description = description;
            Visible = false;
            Level = level;
            PointsToBoost = pointsToBoost;
            AttributeToBoost = attributeToBoost;
        }        */
        }
    }

function checkAgentName(playerName) {
    if (playerName == "Adam Rizzo") {
        console.log("Dev Flattery achievement obtained!");
        return true;
    }
    else
        return false;
}

function checkAgencyName(agencyName) {
    if (agencyName == "Wolverine Studios") {
        console.log("Studio Flattery achievement obtained!");
        return true;
    }
    else
        return false;
}