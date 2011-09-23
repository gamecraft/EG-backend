# helper methods #
## add TeamMember to Team ##
    PUT <endpoint>/Team/<Team._id>/member
    BODY { memberId: "" }

## add Achievement to Team ##
    PUT <endpoint>/Team/<Team._id>/achievement
    BODY { achievementId: "" }

## add/update Skill to TeamMember ##
    PUT <endpoint>/TeamMember/<TeamMember._id>/skill
    BODY { skillId: "", level: <number> }

## add Achievement to TeamMember ##
    PUT <endpoint>/TeamMember/<TeamMember._id>/achievement
    BODY { achievementId: "" }

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
