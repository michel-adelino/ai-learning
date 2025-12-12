// Generate a direct upload URL for teachers to upload videos to MUX
// NOTE: Add role check manually in Xano visual editor if needed
query "mux/upload-url" verb=POST {
  api_group = "all endpoints"
  auth = "users"

  input {
    text cors_origin?
  }

  stack {
    // Construct Basic Auth Header for MUX
    var $basic_auth {
      value = "Basic " ~ (($env.MUX_TOKEN_ID ~ ":" ~ $env.MUX_TOKEN_SECRET) | base64_encode)
    }
  
    // Request direct upload URL from MUX
    api.request {
      url = "https://api.mux.com/video/v1/uploads"
      method = "POST"
      params = {
        cors_origin       : $input.cors_origin
        new_asset_settings: {
          playback_policy: ["public"],
          encoding_tier: "baseline"
        }
      }
    
      headers = []
        |push:("Authorization: " ~ $basic_auth)
        |push:"Content-Type: application/json"
    } as $mux_api_call
  }

  response = {
    upload_url: $mux_api_call.response.result.data.url
    upload_id : $mux_api_call.response.result.data.id
  }

  tags = ["mux", "teacher"]
}
