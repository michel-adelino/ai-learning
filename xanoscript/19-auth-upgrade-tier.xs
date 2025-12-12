// Upgrade User Tier - Update the authenticated user's subscription tier
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// In production, this would integrate with a payment provider (Stripe, etc.)
query "auth/upgrade-tier" verb=POST {
  api_group = "all endpoints"

  input {
    text tier
  }

  stack {
    // Validate tier value
    precondition ($input.tier == "pro" || $input.tier == "ultra") {
      error_type = "inputerror"
      error = "Invalid tier. Must be 'pro' or 'ultra'."
    }

    // Get current user
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user

    precondition ($user != null) {
      error_type = "accessdenied"
      error = "User not found."
    }

    // Prevent upgrading if already at ultra (highest tier)
    precondition ($user.tier != "ultra") {
      error_type = "inputerror"
      error = "You are already at the highest tier."
    }

    // Prevent "upgrading" to same tier
    precondition ($user.tier != $input.tier) {
      error_type = "inputerror"
      error = "You are already on the " + $input.tier + " tier."
    }

    // Prevent downgrading (pro trying to go to free, ultra trying to go to pro)
    // This is handled implicitly since we only allow "pro" or "ultra" as input
    // and we already check for same-tier above

    // Update user tier
    db.edit users {
      field_name = "id"
      field_value = $auth.id
      data = {
        tier: $input.tier,
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
    created_at: $updated_user.created_at,
    updated_at: $updated_user.updated_at
  }
  
  tags = ["auth"]
}
