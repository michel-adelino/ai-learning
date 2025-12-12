// Get Featured Courses - Returns featured courses with modules and lessons
query courses/featured verb=GET {
  input {}

  stack {
    // Query featured courses
    db.query courses {
      where = $db.courses.featured == true
      sort = {courses.id: "desc"}
    } as $courses

    // Get all modules
    db.query modules {
      sort = {modules.order_index: "asc"}
    } as $allModules

    // Get all lessons
    db.query lessons {
      sort = {lessons.order_index: "asc"}
    } as $allLessons
  }

  response = {
    courses: $courses
    modules: $allModules
    lessons: $allLessons
  }

  tags = ["courses"]
}
