# Events #

## phase.finished.changed ##
Dispatched when phase is manually set as finished.

### data ###
    {
        _id: ""
    }
    
## phase.active.changed ##
Dispatched when phase is manually set as active.

### data ###
    {
        _id: ""
    }

## team.totalPoints.changed ##
Dispatched when a Team.totalPoints has been changed

### data ###
    {
        _id: "",
        totalPoints: <number>
    }
    
## team.totalLevel.changed ##
Dispatched when a Team.totalLevel has been changed

### data ###
    {
        _id: "",
        totalLevel: <number>
    }
