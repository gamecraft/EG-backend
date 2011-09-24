module.exports = {
    name: "Achievement",
    instance: {
        fields: {
            name : "",
            description : "",
            toMasterSkill: "", // the name of the MasterSkill to which they apply
            pointsReward : 0, // the number of team points that is rewarded for the given achievment
            image : "", // the path to the image,
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
