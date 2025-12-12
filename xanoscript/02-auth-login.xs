// Authenticates a user via email and password and returns an auth token.
query "auth/login" verb=POST {
  api_group = "all endpoints"

  input {
    // The user's email address
    email email
  
    // The user's password
    text password {
      sensitive = true
    }
  }

  stack {
    // Retrieve the user by email to verify credentials
    db.get users {
      field_name = "email"
      field_value = $input.email
    } as $user
  
    // Ensure the user exists before proceeding
    precondition ($user != null) {
      error_type = "accessdenied"
      error = "Invalid email or password."
    }
  
    // Verify the provided password against the stored hash
    security.check_password {
      text_password = $input.password
      hash_password = $user.password
    } as $password_match
  
    // Stop execution if the password does not match
    precondition ($password_match) {
      error_type = "accessdenied"
      error = "Invalid email or password."
    }
  
    // Generate an authentication token for the user
    security.create_auth_token {
      table = "users"
      extras = {}
      expiration = 604800
      id = $user.id
    } as $authToken
  }

  response = {
    authToken: $authToken
    user: {
      id: $user.id
      email: $user.email
      first_name: $user.first_name
      last_name: $user.last_name
      avatar_url: $user.avatar_url
      tier: $user.tier
      role: $user.role
      created_at: $user.created_at
      updated_at: $user.updated_at
    }
  }
  tags = ["auth"]
}
