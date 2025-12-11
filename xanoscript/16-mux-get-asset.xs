// MUX Get Asset Status - Check the status of an uploaded video
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// 
// After a video is uploaded, it takes time for MUX to process it.
// This endpoint checks the status and returns the playback_id when ready.
//
// IMPLEMENTATION IN XANO:
// 1. Add "External API Request" function from the function stack
// 2. URL: https://api.mux.com/video/v1/assets/{asset_id}
// 3. Method: GET
// 4. Authentication: Basic Auth
//    - Username: $env.MUX_TOKEN_ID
//    - Password: $env.MUX_TOKEN_SECRET
// 5. Map the response fields to output

query "mux/asset/{asset_id}" verb=GET {
  api_group = "all endpoints"

  input {
    text asset_id
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
      error = "Only teachers can check video status."
    }

    // Use Xano's "External API Request" function:
    // GET https://api.mux.com/video/v1/assets/$input.asset_id
    // Basic Auth: MUX_TOKEN_ID / MUX_TOKEN_SECRET
    // Store result as $muxResponse
  }

  response = {
    id: $muxResponse.data.id
    status: $muxResponse.data.status
    playback_id: $muxResponse.data.playback_ids[0].id
    duration: $muxResponse.data.duration
    aspect_ratio: $muxResponse.data.aspect_ratio
  }

  tags = ["mux", "teacher"]
}
