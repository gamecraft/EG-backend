module.exports = {
    name: "Skill",
    instance: {
        fields: {
            name: "", // the name of the current level of the skill. i.e - Fire Tomato
            parentName : "", // the name of the parent skill. i.e - Pomodoro or NLP
            description : "", 
            level: 0, // the current level. Skill points for buying are equal ot it.
            image : "", // the path to the image
            createdAt: (new Date()),
            updatedAt: (new Date())
        },
        on: {
            save: function() {
                this.updatedAt = new Date();
            }
        }
    }
}
