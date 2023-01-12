#!/bin/bash

json_file="/etc/nethcti/users.json"
register_path="./register_user.sh"
call_path='./asterisk_call.sh'

# check if json file exists
if [ ! -f "$json_file" ]
then
    echo "Error: JSON file not found at $json_file" >&2
    exit 1
fi

# Parse the JSON file to extract the webrtc extensions' user and password
extensions=$(jq -c -r '. | to_entries[] | select(.value.endpoints.extension) | .value.endpoints.extension | to_entries[] | select(.value.type == "webrtc") | .value | {user,password}' $json_file)

# Iterate through each extension and pass the user and password to the script
while read -r ext; do
    user=$(echo $ext | jq -r '.user')
    secret=$(echo $ext | jq -r '.password')
    # Register the extensions
    $register_path $user $secret &
done <<< "$extensions"

# Wait the extensions to be registered
sleep 5

# Start a call from the PBX to 5 random users every minute
while true; do
    random_users=$(echo "$extensions" | tr '\n' ' ' | tr ' ' '\n' | shuf | head -5)
    while read -r ext; do
        user=$(echo $ext | jq -r '.user')
        # Start calls from PBX
        $call_path $user &
    done <<< "$random_users"
    sleep 60
done