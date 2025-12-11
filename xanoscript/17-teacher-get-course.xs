// Teacher Get Single Course - Get a course with modules and lessons (teachers only)
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "teacher/courses/{course_id}" verb=GET {
  api_group = "all endpoints"

  input {
    int course_id
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
      error = "Only teachers can access this endpoint."
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
      error = "You can only view your own courses."
    }

    // Get modules for this course
    db.query modules {
      where = $db.modules.course == $course.id
      sort = {modules.order_index: "asc"}
      return = {type: "list"}
    } as $modules

    // Get all lessons for the course
    db.query lessons {
      join = {
        modules: {
          table: "modules"
          where: $db.lessons.module == $db.modules.id
        }
      }
      where = $db.modules.course == $course.id
      sort = {lessons.order_index: "asc"}
      return = {type: "list"}
    } as $lessons
  }

  response = {
    id: $course.id
    title: $course.title
    slug: $course.slug
    description: $course.description
    image_url: $course.image_url
    category: $course.category
    tier: $course.tier
    featured: $course.featured
    teacher: $course.teacher
    created_at: $course.created_at
    modules: $modules
    lessons: $lessons
  }

  tags = ["teacher", "courses"]
}
