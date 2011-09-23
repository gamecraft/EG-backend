# Events #

## phase.tick ##
Dispatched when phase is running. Once per second.

### data ###
    {
        _id: "",
        name: "",
        timeLeft: <number in miliseconds>
    }

## team.points.changed ##
Dispatched when a Team.totalPoints has been changed

### data ###
    {
        _id: "",
        totalPoints: <number>
    }
