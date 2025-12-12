// Teacher Get Single Course - Get a course with modules and lessons (teachers only)
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// NOTE: Build ownership check manually in Xano visual editor - XanoScript has parsing bugs
query "teacher/courses/{course_id}" verb=GET {
  api_group = "all endpoints"
  auth = "users"

  input {
    int course_id
  }

  stack {
    // Get the course by ID
    db.get courses {
      field_name = "id"
      field_value = $input.course_id
    } as $course
  
    precondition ($course != null) {
      error_type = "inputerror"
      error = "Course not found."
    }
  
    // Get modules for this course
    db.query modules {
      where = $db.modules.course == $course.id
      sort = {modules.order_index: "asc"}
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
    } as $lessons
  }

  response = {
    id         : $course.id
    title      : $course.title
    slug       : $course.slug
    description: $course.description
    image_url  : $course.image_url
    category   : $course.category
    tier       : $course.tier
    featured   : $course.featured
    teacher    : $course.teacher
    created_at : $course.created_at
    modules    : $modules
    lessons    : $lessons
  }

  tags = ["teacher", "courses"]
}
