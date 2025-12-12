// Retrieve video asset details from Mux using the provided Asset ID.
query "mux/get_asset" verb=GET {
  api_group = "all endpoints"
  auth = "users"

  input {
    // The unique identifier for the Mux asset.
    text asset_id
  }

  stack {
    // Make a GET request to the Mux API to retrieve asset details.
    api.request {
      url = "https://api.mux.com/video/v1/assets/" ~ $input.asset_id
      method = "GET"
      headers = []
        |push:("Authorization: Basic " ~ (($env.MUX_TOKEN_ID ~ ":" ~ $env.MUX_TOKEN_SECRET)|base64_encode))
        |push:"Content-Type: application/json"
    } as $muxResponse
  }

  response = {
    id          : $muxResponse.response.result.data.id
    status      : $muxResponse.response.result.data.status
    playback_id : $muxResponse.response.result.data.playback_ids[0].id
    duration    : $muxResponse.response.result.data.duration
    aspect_ratio: $muxResponse.response.result.data.aspect_ratio
  }

  tags = ["mux", "teacher"]
}
