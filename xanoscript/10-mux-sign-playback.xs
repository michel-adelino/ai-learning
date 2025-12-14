// Generates signed JWTs for Mux video playback, thumbnails, and storyboards.
query "mux/sign_playback" verb=POST {
  api_group = "all endpoints"
  auth = "users"

  input {
    // The Mux Playback ID to sign
    text playback_id
  }

  stack {
    // Fetch the authenticated user's details
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user
  
    // Ensure the user exists
    precondition ($user != null) {
      error_type = "accessdenied"
      error = "User not found."
    }
  
    // Create signed JWT for Video Playback
    security.jws_encode {
      headers = {alg: "RS256", kid: $env.MUX_SIGNING_KEY_ID}
      claims = {sub: $input.playback_id, aud: "video"}
      key = $env.MUX_SIGNING_KEY|base64_decode
      signature_algorithm = "RS256"
      ttl = 3600
    } as $playbackToken
  
    // Create signed JWT for Thumbnails
    security.jws_encode {
      headers = {alg: "RS256", kid: $env.MUX_SIGNING_KEY_ID}
      claims = {sub: $input.playback_id, aud: "thumbnail"}
      key = $env.MUX_SIGNING_KEY|base64_decode
      signature_algorithm = "RS256"
      ttl = 3600
    } as $thumbnailToken
  
    // Create signed JWT for Storyboards
    security.jws_encode {
      headers = {alg: "RS256", kid: $env.MUX_SIGNING_KEY_ID}
      claims = {sub: $input.playback_id, aud: "storyboard"}
      key = $env.MUX_SIGNING_KEY|base64_decode
      signature_algorithm = "RS256"
      ttl = 3600
    } as $storyboardToken
  }

  response = {
    playbackToken  : $playbackToken
    thumbnailToken : $thumbnailToken
    storyboardToken: $storyboardToken
  }

  tags = ["mux", "video"]
}