class Region {
    constructor(name) {
        this.name = name;
        this.distortionLevel;
        this.corrupted = "Yes";

        if (name == "Hyrule") {
            this.distortionLevel = 73;
        }
        else if (name == "Kanto") {
            this.distortionLevel = 46;
        }
        else if (name == "Mushroom Kingdom") {
            this.distortionLevel = 81;
        }
    }
}

function createInitialRegions() {
    hyrule = new Region("Hyrule");
    kanto = new Region("Kanto");
    mushroomKingdom = new Region("Mushroom Kingdom");
    //regions.push(new Region("Hyrule"));
    //regions.push(new Region("Kanto"));
    //regions.push(new Region("Mushroom Kingdom"));
}