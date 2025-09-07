@echo off
echo Testing Article Update Endpoint
echo ================================

REM Configuration
set API_URL=http://localhost:3000/api/articles/a2
set TEST_IMAGE=test-image.jpg
set JWT_TOKEN=your_jwt_token_here
set SESSION_COOKIE=your_session_cookie_here

echo Testing with JWT token authentication...
curl --location --request PUT "%API_URL%" ^
--header "Authorization: Bearer %JWT_TOKEN%" ^
--form "title=Test Article Title" ^
--form "status=Published" ^
--form "content=<h1>Test Article Content</h1>" ^
--form "featuredImage=@%TEST_IMAGE%" ^
--verbose

echo.
echo ================================
echo Testing with session cookie authentication...
curl --location --request PUT "%API_URL%" ^
--header "Cookie: token=%SESSION_COOKIE%" ^
--form "title=Test Article Title Cookie" ^
--form "status=Draft" ^
--form "content=<h1>Test Article Content Cookie</h1>" ^
--form "featuredImage=@%TEST_IMAGE%" ^
--verbose

echo.
echo ================================
echo Testing without authentication (should fail)...
curl --location --request PUT "%API_URL%" ^
--form "title=Unauthorized Test" ^
--form "status=Published" ^
--form "content=<h1>Unauthorized Content</h1>" ^
--form "featuredImage=@%TEST_IMAGE%" ^
--verbose

echo.
echo ================================
echo Testing health endpoint...
curl --location --request GET "http://localhost:3000/health" ^
--verbose

echo.
echo Test completed!
pause