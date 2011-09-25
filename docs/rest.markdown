# helper methods #
## mark Phase as finished ##
Will record the current value of every Team once the phase is finined in Team.finishedPhases array.
This operation accepts array of { team, juryPoints } objects which indicate how many points are assigned to given Team

If Phase._id is equal to "current" then current active Phase will be marked as finished.

    PUT <endpoint>/Phase/<Phase._id>/finished
    BODY [ 
        { 
            teamId: "", 
            juryPoints: 0 
        },
        ... 
    ]

### response with status 200 ###
    {success: true, data: [<Team>, <Team>, ...]}
    
## mark Phase as active ##
Sets Phase as active. 

If Phase._id is equal to "next", then next Phase will be set as active.

    PUT <endpoint>/Phase/<Phase._id>/active
    
### response with status 200 ###
    {success: true, data: [<Team>, <Team>, ...]}
    
## add Points to Team ##
Simply adds given points to a team

    PUT <endpoint>/Team/<Team._id>/points
    BODY { points: <number> }

### response with status 200 ###
    {success: true, data: <Team>}

## add Points to Member ##
Simply adds given points to a member, this also adds given points to member's Team.totalPoints

    PUT <endpoint>/TeamMember/<TeamMember._id>/points
    BODY { points: <number> }
    
### response with status 200 ###
    {success: true, data: <TeamMember>}

## add TeamMember to Team ##
Updates 'teamId' property of the TeamMember pointing to Team._id

    PUT <endpoint>/Team/<Team._id>/member
    BODY { memberId: "" }
    
### response with status 200 ###
    {success: true, data: { team: <Team>, member: <TeamMember> }}

## add Achievement to Team ##
Simply appends Achievement to Team.achievements, will also add Achievement.rewardPoints to Team.totalPoints

    PUT <endpoint>/Team/<Team._id>/achievement
    BODY { achievementId: "" }
    
### response with status 200 ###
    {success: true, data: <Team> }

## add/update Skill to TeamMember ##
Appends or Updates Skill to TeamMember.skills collection as well as
appends or updates the Team.skills collection by calculating its avgLevel per TeamMembers

    PUT <endpoint>/TeamMember/<TeamMember._id>/skill
    BODY { skillId: "", level: <number> }
    
### response with status 200 ###
    {success: true, data: <TeamMember> }

## add Achievement to TeamMember ##
Appends Achievement to TeamMember as well as appends it to the Team of the member. 
Will also add Achievement.rewardPoints to TeamMember.points and Team.totalPoints.

    PUT <endpoint>/TeamMember/<TeamMember._id>/achievement
    BODY { achievementId: "" }
    
### response with status 200 ###
    {success: true, data: <TeamMember> }

# generic CRUD members #

## request template ##
    GET|POST|PUT|DELETE <url>

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

# CRUD operations #

## create ##
    POST <endpoint>/<objectName>
    BODY {field: value}
### response ###
    data={_id:"", field:value}

## update ##
    PUT <endpoint>/<objectName>/<Object._id>
    BODY<(partial) object>
### response ###
    data=<updated fields from object>

## delete ##
    DELETE <ednpoint>/<objectName>/<Object._id>
### response ###
    data={field: value}

## list ##
    GET <endpoint>/<objectName>?spec={field:value} ( &skip=<number> ( &limit=<number> ) )

### response ###
    data=[<Object>, <Object>, ... ]
    allCount=<number>

## get ##
    GET <endpoint>/<objectName>/<_id>(?deep=true|false)

### response ###
    data=[<Object>, <Object>, ... ]

# examples #
    GET http://<endpoint>/<objectName>?limit=10&skip=2
    GET http://<endpoint>/<objectName>/<objectId>?deep=true
    GET http://<endpoint>/<objectName>/<objectId>?spec="{...}"&limit=<number>&skip=<number>
    POST http://<endpoint>/<objectName> data: "{....}"
    PUT http://<endpoint>/<objectName>/<objectId> data: "{...}"
    DELETE http://<endpoint>/<objectName>/<objectId>
