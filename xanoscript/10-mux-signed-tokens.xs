// MUX Signed Tokens - Generate signed playback tokens for video
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// 
// This endpoint is complex and requires MUX JWT signing.
// It's recommended to build this in Xano's visual builder instead.
// 
// Required Environment Variables in Xano:
// - MUX_SIGNING_KEY_ID (your MUX signing key ID)
// - MUX_SIGNING_KEY (your MUX private key in base64)
//
// Steps to create in Xano Visual Builder:
// 1. Create POST /mux/signed-tokens endpoint with auth required
// 2. Input: playback_id (text)
// 3. Use "Create JWS" function to generate tokens
// 4. Return playbackToken, thumbnailToken, storyboardToken

query mux/signed-tokens verb=POST {
  input {
    text playback_id
  }

  stack {
    // Get user to verify authentication
    db.get users {
      field_name = "id"
      field_value = $auth.id
      output = ["id", "tier"]
    } as $user

    precondition ($user != null) {
      error_type = "unauthorized"
      error = "Authentication required."
    }

    // Generate playback token
    security.jws_encode {
      headers = { "alg": "RS256", "typ": "JWT" }
      claims = { "sub": $input.playback_id, "aud": "v" }
      key = $env.MUX_SIGNING_KEY
      signature_algorithm = "RS256"
      ttl = 3600
    } as $playbackToken

    // Generate thumbnail token  
    security.jws_encode {
      headers = { "alg": "RS256", "typ": "JWT" }
      claims = { "sub": $input.playback_id, "aud": "t" }
      key = $env.MUX_SIGNING_KEY
      signature_algorithm = "RS256"
      ttl = 3600
    } as $thumbnailToken

    // Generate storyboard token
    security.jws_encode {
      headers = { "alg": "RS256", "typ": "JWT" }
      claims = { "sub": $input.playback_id, "aud": "s" }
      key = $env.MUX_SIGNING_KEY
      signature_algorithm = "RS256"
      ttl = 3600
    } as $storyboardToken
  }

  response = {
    playbackToken: $playbackToken,
    thumbnailToken: $thumbnailToken,
    storyboardToken: $storyboardToken
  }

  tags = ["mux", "video"]
}
