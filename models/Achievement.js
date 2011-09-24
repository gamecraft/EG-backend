module.exports = {
    name: "Achievement",
    instance: {
        fields: {
            name : null,
            description : null,
            toMasterSkill: null, // the name of the MasterSkill to which they apply
            pointsReward : null, // the number of team points that is rewarded for the given achievment
            image : null, // the path to the image,
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
