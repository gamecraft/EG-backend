module.exports = {
    name: "Phase",
    instance: {
        fields: {
            name: "",
            active: false,
            activatedAt: null,
            finished: false,
            finishedAt: null,
            duration: 0,
            orderIndex: 0,
            teamScore : [],
            createdAt: (new Date()),
            updatedAt: (new Date())
        }
    }
}
