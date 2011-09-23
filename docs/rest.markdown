# examples #
    GET http://<endpoint>/<objectName>?limit=10&skip=2
    GET http://<endpoint>/<objectName>/<objectId>?deep=true
    POST http://<endpoint>/<objectName> data: "{....}"
    PUT http://<endpoint>/<objectName>/<objectId> data: "{...}"
    DELETE http://<endpoint>/<objectName>/<objectId>

# usage notes #

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

# CRUD operations #

## create ##
    POST <endpoint>/<objectName>
    BODY {field: value}
### response ###
    data={_id:"", field:value}

## update ##
    PUT <endpoint>/<objectName>/<Object.id>
    BODY<(partial) object>
### response ###
    data=<updated fields from object>

## delete ##
    DELETE <ednpoint>/<objectName>/<Object.id>
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
