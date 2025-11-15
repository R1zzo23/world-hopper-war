class Person {
    constructor(name) {
        this.name = name;
        this.maxHP;
        this.maxMP;
        this.strength;
        this.defense;
        this.speed;
        this.currentHP;
        this.currentMP;
        this.homeRegion;
        this.moveList = [];

        if (this.name == "Link") {
            this.maxHP = 70;
            this.maxMP = 5;
            this.strength = 25;
            this.defense = 15;
            this.speed = 2;
            this.homeRegion = hyrule;
        }

        else if (this.name == "Mario") {
            this.maxHP = 50;
            this.maxMP = 15;
            this.strength = 15;
            this.defense = 10;
            this.speed = 5;
            this.homeRegion = mushroomKingdom;
        }

        else if (this.name == "Pikachu") {
            this.maxHP = 40;
            this.maxMP = 30;
            this.strength = 10;
            this.defense = 5;
            this.speed = 10
            this.homeRegion = kanto;
        }

        this.currentHP = this.maxHP;
        this.currentMP = this.maxMP;

        this.knowYourRole = () => {
            console.log("I am a proud " + this.type + "! My skills are: negotiation (" + this.negotiation +") || training (" + this.training + ") || marketing (" + this.marketing + ")");
        };

        this.addAttack = (x) => {
            var min = this.strength + x.minDamage;
            var max = this.strength + x.maxDamage;
            x.minDamage = min;
            x.maxDamage = max;
            this.moveList.push(x);
        }
    }
}

class Enemy {
    constructor(name, maxHP, strength, defense, speed, regionFound, enemyType) {
        this.name = name;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.strength = strength;
        this.defense = defense;
        this.speed = speed;
        this.regionFound = regionFound;
        this.enemyType = enemyType;
        this.moveList = [];

        this.addAttack = (x) => {
            var min = this.strength + x.minDamage;
            var max = this.strength + x.maxDamage;
            x.minDamage = min;
            x.maxDamage = max;
            this.moveList.push(x);
        }
    }
}

const enemyType = {
    Normal: "Normal",
    Hybrid: "Hybrid",
    MiniBoss: "Mini Boss",
    Boss: "Boss"
}