#!/bin/bash

# Get the extension's username and password from command line arguments
extension=$1
secret=$2
port=8988

# Check parameters
if [ -n "$extension" ] && [ -n "$secret" ]
then
    echo "Extension to register: $extension"
    echo "Secret to register: $secret"
else
    echo "Registration error: Wrong parameters!"
    exit 0
fi

# Create session
transaction_id=$(date +%s | sha256sum | base64 | head -c 32)
session=$(curl -s -X POST -H "Content-Type: application/json" -d '{ "janus" : "create", "transaction" : "$transaction_id"}' http://127.0.0.1:$port/janus)

# Get the session ID from the JSON response
session_id=$(echo $session | jq '.data.id')

echo "Session id $extension: $session_id"

# Attach to a plugin
transaction_id=$(date +%s | sha256sum | base64 | head -c 32)
response=$(curl -s -H "Content-Type: application/json" -X POST http://127.0.0.1:$port/janus/$session_id -d '{"janus": "attach", "transaction": "'$transaction_id'", "plugin": "janus.plugin.sip"}')

# Get the handle ID from the JSON response
attach_id=$(echo $response | jq '.data.id')

# Register extension
transaction_id=$(date +%s | sha256sum | base64 | head -c 32)
response=$(curl -s -H "Content-Type: application/json" -X POST http://127.0.0.1:$port/janus/$session_id/$attach_id -d '{"janus": "message", "transaction": "'$transaction_id'", "body": {"display_name": "'$extension'", "proxy": "sip:127.0.0.1:5060", "refresh": false, "request": "register", "username": "sip:'$extension'@127.0.0.1", "secret": "'$secret'", "sips": false}}')

echo "Register response $extension: $response"

while true; do
    # check status
    transaction_id=$(date +%s | sha256sum | base64 | head -c 32)
    status=$(curl -s http://127.0.0.1:$port/janus/$session_id?rid=$transaction_id&maxev=10)

    # Extract the value of the "event" key
    event=$(echo $status | jq '.plugindata.data.result.event')

    # Remove the surrounding quotes from the event value
    event="${event%\"}"
    event="${event#\"}"

    # Check if the event value is equal to "registered"
    if [ "$event" == "registered" ]
    then
        echo "Registration status $extension: $event"
        echo "Status $extension: $status"
    else
        echo "Status $extension: $status"
    fi
    sleep 1
done
