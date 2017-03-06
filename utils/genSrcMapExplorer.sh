#!/bin/bash

# DESCRIPTION:
# This script will generate Source Map Explorers and output them in the _dist/dev folder
# To view Source Map Explorers :
# - Run `yarn build` Or `yarn build:aot`
# - Run `yarn serve`
# - Navigate to http://127.0.0.1:3000/dev/src-map-explorers

BLUE="\e[1;34m%-6s\e[m\n"
LINKS=()


# Public: Returns a message
#
# $1 - Message
#
# Examples: msg "Hello World!"
#
# Returns a message
function msg {
    printf "$BLUE" "$1"
}


# Generate Source Maps
msg "Generate source map explorer [y/n]? Yes?"
read answer
answer=${answer:-y}

if  [ $answer == 'y' ]; then
    mkdir -p ./_dist/dev/src-map-explorers
    for file in _dist/*.js; do
        fileNameWithExt=${file##*/}
        fileName=${fileNameWithExt%.js}
        fileNameHtml=$fileName".html"

        LINKS+=("<p><a href=\""$fileNameHtml"\">"$fileNameWithExt"</a></p>")
        echo "Generating source map explorer for: " $fileNameWithExt
        yarn explore -- --html $file > "./_dist/dev/src-map-explorers/"$fileNameHtml
    done

    cat > ./_dist/dev/src-map-explorers/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Source Map Explorer</title>
</head>
<body>
    <h1>Source Map Explorer</h1>
    ${LINKS[*]// / }
</body>
</html>
EOF

    msg "Done! Source Map Explorers can be viewed at http://<HOST>/dev/src-map-explorers"
else
    msg "No Source Map Explorers have been generated!"
fi


# Launch Server
msg "Launch Server [y/n]? Yes?"
read serverAnswer
serverAnswer=${serverAnswer:-y}

if  [ $serverAnswer == 'y' ]; then
  yarn serve
fi


