#!/bin/bash

# Assign extension to call and file to play
extension=$1
audio_file="beep"

# Execute originate command
result=$(asterisk -rx "channel originate PJSIP/$extension application playback $audio_file")

# Check if the call was successful
if [ -n "$result" ]; then
    echo "call failed: $result"
else
    echo "call to $extension was successful"
fi