// Get MUX upload status - Returns upload status and asset_id when ready
query "mux/get_upload" verb=GET {
  api_group = "all endpoints"
  auth = "users"

  input {
    text upload_id
  }

  stack {
    // Make a GET request to the Mux API to retrieve upload status
    api.request {
      url = "https://api.mux.com/video/v1/uploads/" ~ $input.upload_id
      method = "GET"
      headers = []
        |push:("Authorization: Basic " ~ (($env.MUX_TOKEN_ID ~ ":" ~ $env.MUX_TOKEN_SECRET)|base64_encode))
        |push:"Content-Type: application/json"
    } as $muxResponse
  }

  response = {
    id       : $muxResponse.response.result.data.id
    status   : $muxResponse.response.result.data.status
    asset_id : $muxResponse.response.result.data.asset_id
  }

  tags = ["mux", "teacher"]
}
