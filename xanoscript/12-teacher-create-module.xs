// Teacher Create Module - Create a new module for a course (teachers only)
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "teacher/modules" verb=POST {
  api_group = "all endpoints"

  input {
    int course_id
    text title filters=trim
    text description?
    int order_index?
  }

  stack {
    // Get the authenticated user
    db.get users {
      field_name = "id"
      field_value = $auth.id
    } as $user

    // Check if user is a teacher
    precondition ($user.role == "teacher" || $user.role == "admin") {
      error_type = "accessdenied"
      error = "Only teachers can create modules."
    }

    // Get the course
    db.get courses {
      field_name = "id"
      field_value = $input.course_id
    } as $course

    precondition ($course != null) {
      error_type = "not_found"
      error = "Course not found."
    }

    // Verify teacher owns this course (or is admin)
    precondition ($course.teacher == $auth.id || $user.role == "admin") {
      error_type = "accessdenied"
      error = "You can only add modules to your own courses."
    }

    // Get count of existing modules to auto-set order_index
    db.query modules {
      where = $db.modules.course == $input.course_id
      return = {type: "count"}
    } as $moduleCount

    // Create the module
    db.add modules {
      data = {
        created_at: "now"
        course: $input.course_id
        title: $input.title
        description: $input.description
        order_index: $input.order_index ?? $moduleCount
      }
    } as $module
  }

  response = {
    id: $module.id
    course: $module.course
    title: $module.title
    description: $module.description
    order_index: $module.order_index
    created_at: $module.created_at
  }

  tags = ["teacher", "modules"]
}
