# Objects #

## Skill ##
    {
        _id: "", // the unique ID of the skill
        name: "", // the name of the current level of the skill. i.e - Fire Tomato
        parentName : "", // the name of the parent skill. i.e - Pomodoro or NLP
        description : "", 
        level: 0, // the current level. Skill points for buying are equal ot it.
        image : "", // the path to the image
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z",
    }

## Achievement ##
    {
        _id : "",
        name : "",
        description : "",
        toMasterSkill: "", // the name of the MasterSkill to which they apply
        teamPointsReward : 0, // the number of team points that is rewarded for the given achievment
        image : "" // the path to the image,
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z"
    }

## Team ##
    {
        _id: "",
        name: "",
        totalPoints: 0,
        totalLevel: 0,
        skills: [                   // contains also all skills of members and their avgLevel per members having that skill.
            {
                skillId: "",
                totalLevel: <number>,
            },
            ...
        ],
        achievements: [             // contains also all achievements of members
            {
                achievementId: ""
            },
            ...
        ],
        finishedPhases: [           // in order of finished Phase, a snapshot of current totalPoints and jury's points awards
            {
                phaseId: "",
                name: "",
                totalPoints: 0,
                juryPoints: 0
            },
            ...
        ],
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z"
    }

## TeamMember ##
    {
        _id: "",
        name: "",
        points: 0,
        teamId: "",
        skills: [
            {
                skillId: "",
                level: <number>
            },
            ...
        ],
        achievements: [
            {
                achievementId: ""
            },
            ...
        ],
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z"
    }

## Phase ##
    {
        _id: "",
        name: "",
        active: false,
        duration: 0,
        orderIndex: 0,
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z"
    }


