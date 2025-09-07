#!/bin/bash

# Test script for article update endpoint
# This script tests the PUT /api/articles/:id endpoint with form data

echo "Testing Article Update Endpoint"
echo "================================"

# Configuration
API_URL="http://localhost:3000/api/articles/a2"
TEST_IMAGE="test-image.jpg"  # Create a small test image first
JWT_TOKEN="your_jwt_token_here"  # Replace with actual JWT token
SESSION_COOKIE="your_session_cookie_here"  # Replace with actual session cookie

# Create a small test image if it doesn't exist
if [ ! -f "$TEST_IMAGE" ]; then
    echo "Creating test image..."
    convert -size 100x100 xc:red "$TEST_IMAGE" 2>/dev/null || \
    echo "red" > "$TEST_IMAGE"  # Fallback if ImageMagick not available
fi

echo "Testing with JWT token authentication..."
curl --location --request PUT "$API_URL" \
--header "Authorization: Bearer $JWT_TOKEN" \
--form 'title="Test Article Title"' \
--form 'status="Published"' \
--form 'content="<h1>Test Article Content</h1>"' \
--form "featuredImage=@\"$TEST_IMAGE\"" \
--verbose

echo ""
echo "================================"
echo "Testing with session cookie authentication..."
curl --location --request PUT "$API_URL" \
--header "Cookie: token=$SESSION_COOKIE" \
--form 'title="Test Article Title Cookie"' \
--form 'status="Draft"' \
--form 'content="<h1>Test Article Content Cookie</h1>"' \
--form "featuredImage=@\"$TEST_IMAGE\"" \
--verbose

echo ""
echo "================================"
echo "Testing without authentication (should fail)..."
curl --location --request PUT "$API_URL" \
--form 'title="Unauthorized Test"' \
--form 'status="Published"' \
--form 'content="<h1>Unauthorized Content</h1>"' \
--form "featuredImage=@\"$TEST_IMAGE\"" \
--verbose

echo ""
echo "================================"
echo "Testing with large file (should fail)..."
# Create a large file for testing
dd if=/dev/zero of=large-file.jpg bs=1M count=6 2>/dev/null || \
fallocate -l 6M large-file.jpg 2>/dev/null || \
echo "Large file test skipped - cannot create large file"

if [ -f "large-file.jpg" ]; then
    curl --location --request PUT "$API_URL" \
    --header "Authorization: Bearer $JWT_TOKEN" \
    --form 'title="Large File Test"' \
    --form 'status="Published"' \
    --form 'content="<h1>Large File Content</h1>"' \
    --form "featuredImage=@\"large-file.jpg\"" \
    --verbose
    rm -f large-file.jpg
fi

echo ""
echo "================================"
echo "Testing health endpoint..."
curl --location --request GET "http://localhost:3000/health" \
--verbose

echo ""
echo "Test completed!"