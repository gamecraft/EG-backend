# About #
This is nodejs based backend for GD system. 

# global usage notes #

## request template ##
    GET|POST|PUT|DELETE <url>?token=<md5(passphrase)>

## response template when status code != 200 ##
    {
        success: false,
        msg: ""
    }

## response template when status code == 200 ##
    {
        success: true,
        data: <object or array>
    }

## CRUD operations ##

### create ###
    POST <endpoint>/<objectName>
    BODY {field: value}
#### response ####
    data={_id:"", field:value}

### update ###
    PUT <endpoint>/<objectName>/<Object.id>
    BODY<(partial) object>
#### response ####
    data=<updated fields from object>

### delete ###
    DELETE <ednpoint>/<objectName>/<Object.id>
#### response ####
    data={field: value}

### list ###
    GET <endpoint>/<objectName>?spec={field:value} ( &skip=<number> ( &limit=<number> ) )

#### response ####
    data=[<Object>, <Object>, ... ]
    allCount=<number>

### get ###
    GET <endpoint>/<objectName>/<_id>(?deep=true|false)

#### response ####
    data=[<Object>, <Object>, ... ]

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
        teamPointsReward : "", // the number of team points that is rewarded for the given achievment
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
        skills: [
            {
                skillId: "",
                level: <number>
            },
            ...
        ],
        createdAt: "2011-09-18T22:26:09.506Z",
        updatedAt: "2011-09-18T22:26:09.506Z"
    }

## Page ##
    {
        _id: "",
        path: "",
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
        updatedAt: "2011-09-18T22:26:09.506Z"
    }


# examples #
    GET http://<endpoint>/Skill?limit=10&skip=2
    GET http://<endpoint>/Skill/skillID?deep=true
