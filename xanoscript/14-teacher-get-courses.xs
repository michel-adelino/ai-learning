// Teacher Get My Courses - Get all courses created by the teacher
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "teacher/courses" verb=GET {
  api_group = "all endpoints"

  input {}

  stack {
    // Get the authenticated user
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user

    // Check if user is a teacher
    precondition ($user.role == "teacher" || $user.role == "admin") {
      error_type = "accessdenied"
      error = "Only teachers can access this endpoint."
    }

    // Get all courses by this teacher
    db.query courses {
      where = $db.courses.teacher == $auth.id
      sort = {courses.created_at: "desc"}
      return = {type: "list"}
    } as $courses
  }

  response = $courses

  tags = ["teacher", "courses"]
}
