class Attack {
    constructor(name, minDamage, maxDamage, mpNeeded, attackType, description) {
        this.name = name;
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
        this.mpNeeded = mpNeeded;
        this.attackType = attackType;
        this.description = description;
    }
}

const attackType = {
    Basic: "Basic",
    Special: "Special"
}

