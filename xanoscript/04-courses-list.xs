// Get All Courses - Returns list of all courses with modules and lessons
query courses verb=GET {
  input {}

  stack {
    // Query all courses
    db.query courses {
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
