module.exports = {
    name: "Team",
    instance: {
        fields: {
            name: null,
            totalPoints: 0,
            skills: [],
            achievements: [],
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
