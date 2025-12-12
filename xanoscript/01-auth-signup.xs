// User Signup - Create new account and return auth token
query "auth/signup" verb=POST {
  api_group = "all endpoints"

  input {
    email email filters=trim|lower
    text password
    text first_name? filters=trim
    text last_name? filters=trim
    text role? filters=trim  // "student" or "teacher", defaults to "student"
  }

  stack {
    // Check if user already exists
    db.get users {
      field_name = "email"
      field_value = $input.email
    } as $existingUser
  
    precondition ($existingUser == null) {
      error_type = "inputerror"
      error = "An account with this email already exists."
    }

    // Validate role input
    precondition ($input.role == null || $input.role == "student" || $input.role == "teacher") {
      error_type = "inputerror"
      error = "Invalid role. Must be 'student' or 'teacher'."
    }
  
    // Create new user
    db.add users {
      data = {
        created_at: "now"
        email     : $input.email
        password  : $input.password
        first_name: $input.first_name
        last_name : $input.last_name
        tier      : "free"
        role      : $input.role ?? "student"
      }
    } as $user
  
    // Generate auth token
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
