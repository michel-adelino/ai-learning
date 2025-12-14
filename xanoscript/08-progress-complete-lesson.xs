// Complete Lesson - Mark a lesson as completed for current user
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "progress/complete-lesson" verb=POST {
  api_group = "all endpoints"
  auth = "users"

  input {
    int lesson_id
  }

  stack {
    // Verify lesson exists
    db.get lessons {
      field_name = "id"
      field_value = $input.lesson_id
    } as $lesson
  
    precondition ($lesson != null) {
      error_type = "inputerror"
      error = "Lesson not found."
    }
  
    // Add progress record
    // NOTE: To handle duplicates, add a unique constraint on (user, lesson)

    db.add user_progress {
      data = {
        user        : $auth.id
        lesson      : $input.lesson_id
        completed   : true
        completed_at: "now"
      }
    } as $progress
  }

  response = {success: true, lesson_id: $input.lesson_id}
  tags = ["progress"]
}