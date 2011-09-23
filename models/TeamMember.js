module.exports = {
    name: "TeamMember",
    instance: {
        fields: {
            name: null,
            points: 0,
            teamId: null,
            skills: [],
            achievements: [],
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
