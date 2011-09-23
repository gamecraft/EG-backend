# Objects #

## Skill ##
    {
        _id: "", // the unique ID of the skill
        name: "", // the name of the current level of the skill. i.e - Fire Tomato
        parentName : "", // the name of the parent skill. i.e - Pomodoro or NLP
        description : "", 
        level: <number>, // the current level. Skill points for buying are equal ot it.
        image : "", // the path to the image
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z",
    }

## Achievment ##
    {
        _id : "",
        name : "",
        description : "",
        toMasterSkill: "", // the name of the MasterSkill to which they apply
        pointsReward : "", // the number of team points that is rewarded for the given achievment
        image : "" // the path to the image,
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z"
    }

## Team ##
    {
        _id: "",
        name: ""
        totalPoints: 0,
        skills: [
            {
                skillId: "",
                avgLevel: <number>,
            },
            ...
        ],
        achievements: [
            {
                achievementId: ""
            },
            ...
        ]
        members: [
            {
                memberId: ""
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
        duration: <number in miliseconds>,
        orderIndex: <number from 0 to X>,
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z",
        teamScore : [] // array where at i-th index is the score for the (i+1)-th team for the phase
    }


