#!/bin/bash
cd "$(dirname "$0")"
export PATH="/c/Program Files/dotnet:$PATH"
dotnet run --project MyBalance.API
