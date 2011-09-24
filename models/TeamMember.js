module.exports = {
    name: "TeamMember",
    instance: {
        fields: {
            name: "",
            points: 0,
            teamId: "",
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
