#!/bin/bash
# Script to seed career story categories via API
# Usage: ./seedCategories.sh <API_BASE_URL> <ADMIN_JWT_TOKEN>

API_BASE=${1:-"http://localhost:8008/api"}
JWT_TOKEN=${2}

if [ -z "$JWT_TOKEN" ]; then
    echo "Usage: $0 <API_BASE_URL> <ADMIN_JWT_TOKEN>"
    echo "Example: $0 http://localhost:8008/api eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    exit 1
fi

# Career story categories to create
declare -a categories=(
    "resume-tips,Resume Tips,Tips and advice for creating effective resumes"
    "interview-tips,Interview Tips,Guidance for successful job interviews"
    "technical-tips,Technical Tips,Technical career advice and insights"
)

echo "Creating career story categories..."

for category_data in "${categories[@]}"; do
    IFS=',' read -r slug name description <<< "$category_data"
    
    echo "Creating category: $name ($slug)"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.txt \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "{\"name\":\"$name\",\"slug\":\"$slug\",\"description\":\"$description\"}" \
        "$API_BASE/blog/categories")
    
    if [ "$response" -eq 201 ]; then
        echo "✓ Created: $name"
    elif [ "$response" -eq 400 ]; then
        echo "⚠ Already exists: $name"
    else
        echo "✗ Failed to create $name (HTTP $response)"
        cat /tmp/response.txt
        echo ""
    fi
done

echo "Category seeding completed!"