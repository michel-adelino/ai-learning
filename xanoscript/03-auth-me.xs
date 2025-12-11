// Retrieve the authenticated user's profile information
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "auth/me" verb=GET {
  api_group = "all endpoints"

  input {
  }

  stack {
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user

    precondition ($user != null) {
      error_type = "accessdenied"
      error = "User not found."
    }
  }

  response = {
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
  tags = ["auth"]
}