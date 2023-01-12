#!/bin/bash

# Get the process ID of all running instances of "register_user.sh"
pid=$(ps -ef | grep "register_user.sh" | grep -v "grep" | awk '{print $2}')

# Check if any processes were found
if [ -z "$pid" ]
then
    echo "No running processes of register_user.sh were found."
    exit 1
fi

# Kill all found processes
for i in $pid
do
    kill -9 $i
done

echo "All running processes of register_user.sh have been terminated."
