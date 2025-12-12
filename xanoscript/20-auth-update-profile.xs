// Update User Profile - Update the authenticated user's profile information
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// Mark all inputs as "not required" in Xano UI
query "auth/profile" verb=PATCH {
  api_group = "all endpoints"

  input {
    text first_name
    text last_name
    text avatar_url
  }

  stack {
    // Get current user
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user

    precondition ($user != null) {
      error_type = "accessdenied"
      error = "User not found."
    }

    // Update user with provided fields
    // If input is empty string, keep existing value; otherwise use new value
    db.edit users {
      field_name = "id"
      field_value = $auth.id
      data = {
        first_name: $input.first_name != "" ? $input.first_name : $user.first_name,
        last_name: $input.last_name != "" ? $input.last_name : $user.last_name,
        avatar_url: $input.avatar_url != "" ? $input.avatar_url : $user.avatar_url,
        updated_at: "now"
      }
    } as $updated_user
  }

  response = {
    id: $updated_user.id,
    email: $updated_user.email,
    first_name: $updated_user.first_name,
    last_name: $updated_user.last_name,
    avatar_url: $updated_user.avatar_url,
    tier: $updated_user.tier,
    role: $updated_user.role,
    created_at: $updated_user.created_at
  }
}
