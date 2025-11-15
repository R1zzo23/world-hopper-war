class Party {
    constructor(leader) {
        this.partyLeader = leader;
        this.partyMembers = [];
        this.items = [];
        this.currentRegion = leader.homeRegion;
        this.activeCharacter = leader;
        this.completedFirstBattle = false;
    }
}