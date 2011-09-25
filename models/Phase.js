module.exports = {
    name: "Phase",
    instance: {
        fields: {
            name: "",
            active: false,
            finished: false,
            duration: 0,
            orderIndex: 0,
            teamScore : [],
            createdAt: (new Date()),
            updatedAt: (new Date())
        }
    }
}
