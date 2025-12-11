// Teacher Create Lesson - Create a new lesson for a module (teachers only)
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "teacher/lessons" verb=POST {
  api_group = "all endpoints"

  input {
    int module_id
    text title filters=trim
    text slug filters=trim|lower
    text description?
    text content?
    text mux_playback_id?
    int duration?
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
      error = "Only teachers can create lessons."
    }

    // Get the module
    db.get modules {
      field_name = "id"
      field_value = $input.module_id
    } as $module

    precondition ($module != null) {
      error_type = "not_found"
      error = "Module not found."
    }

    // Get the course to verify ownership
    db.get courses {
      field_name = "id"
      field_value = $module.course
    } as $course

    // Verify teacher owns this course (or is admin)
    precondition ($course.teacher == $auth.id || $user.role == "admin") {
      error_type = "accessdenied"
      error = "You can only add lessons to your own courses."
    }

    // Check if slug is unique
    db.get lessons {
      field_name = "slug"
      field_value = $input.slug
    } as $existingLesson

    precondition ($existingLesson == null) {
      error_type = "inputerror"
      error = "A lesson with this slug already exists."
    }

    // Get count of existing lessons in module to auto-set order_index
    db.query lessons {
      where = $db.lessons.module == $input.module_id
      return = {type: "count"}
    } as $lessonCount

    // Create the lesson
    db.add lessons {
      data = {
        created_at: "now"
        module: $input.module_id
        title: $input.title
        slug: $input.slug
        description: $input.description
        content: $input.content
        mux_playback_id: $input.mux_playback_id
        duration: $input.duration ?? 0
        order_index: $input.order_index ?? $lessonCount
      }
    } as $lesson
  }

  response = {
    id: $lesson.id
    module: $lesson.module
    title: $lesson.title
    slug: $lesson.slug
    description: $lesson.description
    content: $lesson.content
    mux_playback_id: $lesson.mux_playback_id
    duration: $lesson.duration
    order_index: $lesson.order_index
    created_at: $lesson.created_at
  }

  tags = ["teacher", "lessons"]
}
