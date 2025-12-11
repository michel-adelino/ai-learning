// MUX Create Upload URL - Generate a direct upload URL for teachers
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// 
// IMPORTANT: This endpoint requires MUX API credentials configured in Xano:
// 1. Go to Xano Settings > Environment Variables
// 2. Add MUX_TOKEN_ID (your MUX Access Token ID)
// 3. Add MUX_TOKEN_SECRET (your MUX Access Token Secret)
//
// This endpoint creates a direct upload URL that the teacher's browser
// can use to upload videos directly to MUX without going through your server.

query "mux/upload-url" verb=POST {
  api_group = "all endpoints"

  input {
    text cors_origin?  // Optional: Your frontend domain for CORS
  }

  stack {
    // Get the authenticated user
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user

    // Check if user is a teacher
    precondition ($user.role == "teacher" || $user.role == "admin") {
      error_type = "accessdenied"
      error = "Only teachers can upload videos."
    }

    // Use Xano's "External API Request" function:
    // POST https://api.mux.com/video/v1/uploads
    // Headers: Content-Type: application/json
    // Auth: Basic Auth with MUX_TOKEN_ID / MUX_TOKEN_SECRET
    // Body (JSON):
    // {
    //   "cors_origin": $input.cors_origin ?? "*",
    //   "new_asset_settings": {
    //     "playback_policy": ["public"],
    //     "encoding_tier": "baseline"
    //   }
    // }
    // Store result as $muxResponse
  }

  response = {
    upload_url: $muxResponse.data.url
    upload_id: $muxResponse.data.id
    asset_id: $muxResponse.data.asset_id
  }

  tags = ["mux", "teacher"]
}
