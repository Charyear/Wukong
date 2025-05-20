#!/bin/bash
cd /www/wwwroot/heishenhua/wukong
nohup node server.js > output.log 2>&1 &
echo $! > process.pid 