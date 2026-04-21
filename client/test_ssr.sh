#!/bin/bash
node ssr-server.mjs > ssr.log 2>&1 &
SSR_PID=$!
sleep 10
echo "Attempting to curl..."
curl -v http://localhost:3000/ > curl.out 2>&1
echo "Curl exit code: $?"
kill $SSR_PID
echo "--- SSR Log ---"
cat ssr.log
echo "--- Curl Log ---"
cat curl.out
