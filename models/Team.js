module.exports = {
    name: "Team",
    instance: {
        fields: {
            name: null,
            totalPoints: 0,
            skills: [],
            achievements: [],
            members: [],
            createdAt: null,
            updatedAt: null
        },
        on: {
            save: function() {
                this.updatedAt = new Date();
            }
        }
    }
}
