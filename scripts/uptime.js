require("angel")
    .ssh()
        .send("sh ~/install-nodejs2.sh")
        .send(". ~/.nvm/nvm.sh; nvm use v0.4.11")
        .send("forever list")
    .exit()
.export(module);
