curl "https://netverify.com/api/v4/initiate" \
  --verbose \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "$API_KEY_ID:$API_KEY_SECRET" \
  -H "User-Agent: Polymesh CDD-Onboarding/v1.0" \
  -d '{ "customerInternalReference": "xyz", "userReference": "abc" }'

