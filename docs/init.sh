#!/bin/bash

# DESCRIPTION:
# This script will launch EASE Web V2 doc pages.
# It will install ruby and jekyll if they are not already installed

# Variables
BLUE="\e[1;34m%-6s\e[m\n"

# Public: Display script usage and options
#
# Examples: usage
function usage() {
cat << EOF
This script will launch EASE Web V2 doc pages.
It will install ruby and jekyll if they are not already installed
EOF
}

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

usage

msg  "Checking if ruby is installed"
if ! gem list ruby -i > /dev/null 2>&1; then
  msg  "  Installing ruby..."
  brew install ruby
else
  msg  "  Ruby is installed: " & gem list ruby
fi

msg  "Checking if jekyll is installed"
if ! gem list jekyll -i > /dev/null 2>&1; then
  msg  "  Installing jekyll..."
  gem install jekyll
else
  msg  "  jekyll is installed: " & gem list jekyll
fi

msg  "Launching server:"
cd "./docs"
jekyll serve


